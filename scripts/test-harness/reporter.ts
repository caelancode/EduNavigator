import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import type { TestResult, TestReport, CheckResult } from './types';

const CHECK_NAMES = [
  'Format compliance',
  'Strategy correctness',
  'Citation quality',
  'Structured source',
  'Guardrail compliance',
  'Context respect',
  'Reflection quality',
  'Tone check',
  'Must-not-contain',
];

export function printTestResult(index: number, total: number, result: TestResult): void {
  const status = result.status.toUpperCase();
  const statusColor =
    status === 'PASS' ? '\x1b[32m' :
    status === 'WARN' ? '\x1b[33m' :
    status === 'FAIL' ? '\x1b[31m' :
    '\x1b[35m'; // error = magenta
  const reset = '\x1b[0m';

  const failedChecks = result.checks
    .filter((c) => c.result === 'fail' || c.result === 'warn')
    .map((c) => `${c.name}: ${c.message}`)
    .join(', ');

  const suffix = failedChecks ? ` (${failedChecks})` : '';
  console.log(
    `[${String(index + 1).padStart(String(total).length)}/${total}] ${result.id.padEnd(35)} ${statusColor}${status}${reset}${suffix}`,
  );
}

export function printSummary(results: TestResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  // Overall stats
  const passed = results.filter((r) => r.status === 'pass').length;
  const warned = results.filter((r) => r.status === 'warn').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const errored = results.filter((r) => r.status === 'error').length;
  console.log(`\nTotal: ${results.length}  Pass: ${passed}  Warn: ${warned}  Fail: ${failed}  Error: ${errored}`);

  // Check summary table
  console.log('\n| Check                | Pass | Warn | Fail | N/A  |');
  console.log('|----------------------|------|------|------|------|');

  for (const checkName of CHECK_NAMES) {
    const counts: Record<CheckResult, number> = { pass: 0, warn: 0, fail: 0, na: 0 };
    for (const result of results) {
      const check = result.checks.find((c) => c.name === checkName);
      if (check) counts[check.result]++;
    }
    console.log(
      `| ${checkName.padEnd(20)} | ${String(counts.pass).padStart(4)} | ${String(counts.warn).padStart(4)} | ${String(counts.fail).padStart(4)} | ${String(counts.na).padStart(4)} |`,
    );
  }

  // Failures detail
  const failures = results.filter((r) => r.status === 'fail' || r.status === 'error');
  if (failures.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('FAILURES & ERRORS');
    console.log('-'.repeat(80));
    for (const result of failures) {
      console.log(`\n  ${result.id} (${result.name})`);
      if (result.error) {
        console.log(`    ERROR: ${result.error}`);
      }
      for (const check of result.checks) {
        if (check.result === 'fail') {
          console.log(`    FAIL: ${check.name} — ${check.message}`);
        }
      }
    }
  }

  // Warnings detail
  const warnings = results.filter((r) => r.status === 'warn');
  if (warnings.length > 0) {
    console.log('\n' + '-'.repeat(80));
    console.log('WARNINGS');
    console.log('-'.repeat(80));
    for (const result of warnings) {
      console.log(`\n  ${result.id} (${result.name})`);
      for (const check of result.checks) {
        if (check.result === 'warn') {
          console.log(`    WARN: ${check.name} — ${check.message}`);
        }
      }
    }
  }

  // Cost estimate
  let totalInput = 0;
  let totalOutput = 0;
  // We don't have token counts in results currently — use duration as proxy
  console.log(`\nTotal API duration: ${(results.reduce((sum, r) => sum + r.durationMs, 0) / 1000).toFixed(1)}s`);
}

export function writeReport(results: TestResult[]): string {
  const resultsDir = resolve(process.cwd(), 'scripts/test-harness/results');
  mkdirSync(resultsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = resolve(resultsDir, `report-${timestamp}.json`);

  const checkSummary: Record<string, { pass: number; warn: number; fail: number; na: number }> = {};
  for (const checkName of CHECK_NAMES) {
    checkSummary[checkName] = { pass: 0, warn: 0, fail: 0, na: 0 };
    for (const result of results) {
      const check = result.checks.find((c) => c.name === checkName);
      if (check) checkSummary[checkName][check.result]++;
    }
  }

  const report: TestReport = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passed: results.filter((r) => r.status === 'pass').length,
    warned: results.filter((r) => r.status === 'warn').length,
    failed: results.filter((r) => r.status === 'fail').length,
    errored: results.filter((r) => r.status === 'error').length,
    results,
    checkSummary,
  };

  writeFileSync(filePath, JSON.stringify(report, null, 2));
  return filePath;
}
