import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { TestCase, TestCaseFile, TestResult } from './types';
import { callApi, sleep } from './api-caller';
import { parseTestResponse } from './prompt-parser';
import { evaluate } from './evaluator';
import { printTestResult, printSummary, writeReport } from './reporter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CLI argument parsing ---

interface CliArgs {
  id?: string;
  category?: string;
  priority?: 'core' | 'extended';
  delay: number;
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = { delay: 3, dryRun: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--id':
        result.id = args[++i];
        break;
      case '--category':
        result.category = args[++i];
        break;
      case '--priority':
        result.priority = args[++i] as 'core' | 'extended';
        break;
      case '--delay':
        result.delay = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        result.dryRun = true;
        break;
    }
  }

  return result;
}

// --- Main runner ---

function loadTestCases(): TestCaseFile {
  const filePath = resolve(__dirname, 'test-cases.json');
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as TestCaseFile;
}

function filterTestCases(cases: TestCase[], args: CliArgs): TestCase[] {
  let filtered = cases;

  if (args.id) {
    filtered = filtered.filter((tc) => tc.id === args.id);
  }
  if (args.category) {
    filtered = filtered.filter((tc) => tc.category === args.category);
  }
  if (args.priority) {
    filtered = filtered.filter((tc) => tc.priority === args.priority);
  }

  return filtered;
}

async function runTestCase(tc: TestCase): Promise<TestResult> {
  const start = Date.now();

  try {
    const apiResult = await callApi(
      tc.request.message,
      tc.request.context,
      tc.request.history,
    );

    const parseResult = parseTestResponse(apiResult.text);
    const checks = evaluate(tc, parseResult, apiResult.text);

    // Determine overall status from checks
    const hasFail = checks.some((c) => c.result === 'fail');
    const hasWarn = checks.some((c) => c.result === 'warn');
    const status = hasFail ? 'fail' : hasWarn ? 'warn' : 'pass';

    return {
      id: tc.id,
      name: tc.name,
      category: tc.category,
      priority: tc.priority,
      status,
      checks,
      rawResponse: apiResult.text,
      chatText: parseResult.chatText,
      strategiesRaw: parseResult.strategiesRaw,
      strategiesValidated: parseResult.strategiesValidated.length,
      durationMs: apiResult.durationMs,
    };
  } catch (err) {
    return {
      id: tc.id,
      name: tc.name,
      category: tc.category,
      priority: tc.priority,
      status: 'error',
      checks: [],
      rawResponse: '',
      chatText: '',
      strategiesRaw: null,
      strategiesValidated: 0,
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  const testCaseFile = loadTestCases();
  const testCases = filterTestCases(testCaseFile.testCases, args);

  if (testCases.length === 0) {
    console.log('No test cases match the given filters.');
    process.exit(1);
  }

  console.log(`\nEduNavigator Test Harness`);
  console.log(`========================`);
  console.log(`Tests: ${testCases.length} of ${testCaseFile.testCases.length}`);
  if (args.id) console.log(`  Filter: id=${args.id}`);
  if (args.category) console.log(`  Filter: category=${args.category}`);
  if (args.priority) console.log(`  Filter: priority=${args.priority}`);
  console.log(`  Delay: ${args.delay}s between requests`);

  if (args.dryRun) {
    console.log('\n--- DRY RUN (no API calls) ---\n');
    for (const tc of testCases) {
      console.log(
        `  ${tc.id.padEnd(35)} [${tc.priority}] ${tc.category.padEnd(25)} ${tc.name}`,
      );
    }
    console.log(`\nTotal: ${testCases.length} test cases would be run.`);

    // Estimate cost
    const estimatedInputPerCase = 5000;
    const estimatedOutputPerCase = 1750;
    const totalInput = testCases.length * estimatedInputPerCase;
    const totalOutput = testCases.length * estimatedOutputPerCase;
    const costInput = (totalInput / 1_000_000) * 3;
    const costOutput = (totalOutput / 1_000_000) * 15;
    console.log(`Estimated cost: ~$${(costInput + costOutput).toFixed(2)} (${testCases.length} API calls)`);
    console.log(`Estimated time: ~${((testCases.length * (args.delay + 5)) / 60).toFixed(1)} minutes`);
    return;
  }

  console.log('');

  const results: TestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const result = await runTestCase(tc);
    results.push(result);
    printTestResult(i, testCases.length, result);

    // Delay between requests (skip after last)
    if (i < testCases.length - 1) {
      await sleep(args.delay * 1000);
    }
  }

  printSummary(results);

  const reportPath = writeReport(results);
  console.log(`\nReport written to: ${reportPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
