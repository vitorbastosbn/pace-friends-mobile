import { mapHomeSummaryResponse } from '../mappers/homeMapper';
import type { HomeSummary, HomeSummaryResponse } from '../types/home.types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class HomeServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'HomeServiceError';
  }
}

export async function getHomeSummary(userId: string, token: string): Promise<HomeSummary> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/home-summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new HomeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new HomeServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    if (response.status === 403) {
      throw new HomeServiceError('Acesso negado ao seu resumo.', 403);
    }
    throw new HomeServiceError('Nao foi possivel carregar seu resumo.', response.status);
  }

  const data = (await response.json()) as HomeSummaryResponse;
  return mapHomeSummaryResponse(data);
}
