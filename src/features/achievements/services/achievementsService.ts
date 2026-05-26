import type { AchievementApiResponse } from '../types/achievement.types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class AchievementsServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AchievementsServiceError';
  }
}

export async function getUserAchievements(
  token: string
): Promise<AchievementApiResponse[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/achievements/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new AchievementsServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new AchievementsServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    throw new AchievementsServiceError(
      `Erro ao buscar conquistas (HTTP ${response.status}).`,
      response.status
    );
  }

  return (await response.json()) as AchievementApiResponse[];
}
