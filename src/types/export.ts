import { Strategy } from './strategy';
import { LeftRailState } from './left-rail';

export interface ExportPayload {
  context: LeftRailState;
  strategies: Strategy[];
  generatedAt: number;
}

export interface ExportConfig {
  format: 'print' | 'pdf';
  includeContext: boolean;
}
