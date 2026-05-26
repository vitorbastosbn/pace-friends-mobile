import type { LevelUpResult, TrainingPathData } from '../types/trail.types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class TrailServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'TrailServiceError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new TrailServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    if (response.status === 403) {
      throw new TrailServiceError('Acesso negado.', 403);
    }
    if (response.status === 404) {
      throw new TrailServiceError('Recurso nao encontrado.', 404);
    }
    if (response.status === 400) {
      let message = 'Operacao nao permitida.';
      try {
        const body = (await response.json()) as { message?: string };
        if (body.message) message = body.message;
      } catch {
        // use default message
      }
      throw new TrailServiceError(message, 400);
    }
    throw new TrailServiceError(
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

export async function getTrainingPath(
  userId: string,
  token: string
): Promise<TrainingPathData> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/training-path`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new TrailServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<TrainingPathData>(response);
}

export async function levelUp(
  userId: string,
  token: string
): Promise<LevelUpResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/training-path/level-up`, {
      method: 'POST',
      headers: authHeaders(token),
    });
  } catch {
    throw new TrailServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<LevelUpResult>(response);
}
