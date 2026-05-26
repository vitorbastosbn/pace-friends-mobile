import { parseDurationToSeconds } from '../mappers/challengeMapper';

export interface CreateChallengeFormErrors {
  [key: string]: string | undefined;
  title?: string;
  goalDistanceKm?: string;
  deadline?: string;
}

export function validateCreateChallenge(
  title: string,
  goalDistanceKmText: string,
  deadline: string
): CreateChallengeFormErrors {
  const errors: CreateChallengeFormErrors = {};

  if (!title.trim()) {
    errors.title = 'Titulo e obrigatorio.';
  } else if (title.trim().length < 3) {
    errors.title = 'Titulo deve ter pelo menos 3 caracteres.';
  }

  const km = parseFloat(goalDistanceKmText);
  if (!goalDistanceKmText.trim() || isNaN(km)) {
    errors.goalDistanceKm = 'Meta de distancia e obrigatoria.';
  } else if (km <= 0) {
    errors.goalDistanceKm = 'Meta deve ser maior que zero.';
  }

  if (!deadline.trim()) {
    errors.deadline = 'Prazo e obrigatorio.';
  } else {
    const deadlineDate = new Date(deadline + 'T00:00:00');
    if (isNaN(deadlineDate.getTime())) {
      errors.deadline = 'Data invalida. Use o formato YYYY-MM-DD.';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        errors.deadline = 'Prazo nao pode ser no passado.';
      }
    }
  }

  return errors;
}

export interface RegisterActivityFormErrors {
  [key: string]: string | undefined;
  distanceKm?: string;
  duration?: string;
  activityDate?: string;
}

export function validateRegisterActivity(
  distanceKmText: string,
  durationText: string,
  activityDate: string
): RegisterActivityFormErrors {
  const errors: RegisterActivityFormErrors = {};

  const km = parseFloat(distanceKmText);
  if (!distanceKmText.trim() || isNaN(km)) {
    errors.distanceKm = 'Distancia e obrigatoria.';
  } else if (km <= 0) {
    errors.distanceKm = 'Distancia deve ser maior que zero.';
  }

  if (!durationText.trim()) {
    errors.duration = 'Tempo e obrigatorio.';
  } else {
    const seconds = parseDurationToSeconds(durationText);
    if (seconds === null) {
      errors.duration = 'Formato invalido. Use mm:ss ou hh:mm:ss.';
    } else if (seconds <= 0) {
      errors.duration = 'Tempo deve ser maior que zero.';
    }
  }

  if (!activityDate.trim()) {
    errors.activityDate = 'Data e obrigatoria.';
  } else {
    const date = new Date(activityDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      errors.activityDate = 'Data invalida. Use o formato YYYY-MM-DD.';
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) {
        errors.activityDate = 'Data nao pode ser futura.';
      }
    }
  }

  return errors;
}

export function hasFormErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((v) => v !== undefined);
}
