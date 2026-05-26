import type { TrainingPathData } from '../types/trail.types';

/**
 * Passthrough mapper — the API response shape matches the UI model directly.
 * This file exists to maintain the feature structure pattern and allow
 * future transformations without touching screens/hooks.
 */
export function mapTrainingPathData(data: TrainingPathData): TrainingPathData {
  return data;
}
