import type { StreakData } from '../types/streak.types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class StreakServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'StreakServiceError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new StreakServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    if (response.status === 403) {
      throw new StreakServiceError('Acesso negado.', 403);
    }
    if (response.status === 404) {
      throw new StreakServiceError('Recurso nao encontrado.', 404);
    }
    if (response.status === 422 || response.status === 400) {
      throw new StreakServiceError(
        'Dados invalidos. Verifique os campos e tente novamente.',
        response.status
      );
    }
    throw new StreakServiceError(
      `Erro inesperado (HTTP ${response.status}).`,
      response.status
    );
  }
  return (await response.json()) as T;
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getStreak(token: string): Promise<StreakData> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/streak`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new StreakServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<StreakData>(response);
}
