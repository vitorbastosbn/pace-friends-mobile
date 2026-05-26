import type { UserObjective, WeeklyFrequency } from '../types/profile.types';

const VALID_OBJECTIVES: UserObjective[] = [
  'LOSE_WEIGHT',
  'GAIN_MUSCLE',
  'IMPROVE_FITNESS',
  'MAINTAIN',
];

const VALID_FREQUENCIES: WeeklyFrequency[] = ['THREE', 'FOUR', 'FIVE'];

export function isValidObjective(value: string): value is UserObjective {
  return VALID_OBJECTIVES.includes(value as UserObjective);
}

export function isValidFrequency(value: string): value is WeeklyFrequency {
  return VALID_FREQUENCIES.includes(value as WeeklyFrequency);
}

export function validateProfileUpdate(
  objective: string,
  weeklyFrequency: string
): string | null {
  if (!isValidObjective(objective)) {
    return 'Objetivo invalido.';
  }
  if (!isValidFrequency(weeklyFrequency)) {
    return 'Frequencia invalida.';
  }
  return null;
}
