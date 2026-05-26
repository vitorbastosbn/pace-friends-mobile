import type {
  ActivityResponse,
  CheckInResponse,
  CheckInWithUserNameResponse,
  ChallengeProgressResponse,
  ChallengeResponse,
  CreateChallengeRequest,
  RankingResponse,
  RegisterActivityRequest,
  RegisterCheckInRequest,
  ChallengeDetailApiResponse,
  ChallengeDetail,
  FriendChallenge,
  FriendChallengeApiResponse,
  IndividualChallenge,
  IndividualChallengeApiResponse,
} from '../types/challenge.types';
import {
  mapChallengeDetail,
  mapFriendChallenge,
  mapIndividualChallenge,
} from '../mappers/challengeMapper';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class ChallengeServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ChallengeServiceError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new ChallengeServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    if (response.status === 403) {
      throw new ChallengeServiceError('Acesso negado.', 403);
    }
    if (response.status === 404) {
      throw new ChallengeServiceError('Recurso nao encontrado.', 404);
    }
    if (response.status === 422 || response.status === 400) {
      throw new ChallengeServiceError(
        'Dados invalidos. Verifique os campos e tente novamente.',
        response.status
      );
    }
    throw new ChallengeServiceError(
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

export async function getChallenges(
  token: string
): Promise<ChallengeProgressResponse[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/challenges`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<ChallengeProgressResponse[]>(response);
}

export async function getChallengeDetail(
  token: string,
  id: string
): Promise<ChallengeProgressResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<ChallengeProgressResponse>(response);
}

export async function createChallenge(
  token: string,
  req: CreateChallengeRequest
): Promise<ChallengeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/challenges`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(req),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<ChallengeResponse>(response);
}

export async function registerActivity(
  token: string,
  challengeId: string,
  req: RegisterActivityRequest
): Promise<ActivityResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/activities`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(req),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<ActivityResponse>(response);
}

export async function getActivities(
  token: string,
  challengeId: string
): Promise<ActivityResponse[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/activities`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<ActivityResponse[]>(response);
}

// --- FriendChallenge service functions ---

export async function createFriendChallenge(
  token: string,
  data: import('../types/challenge.types').CreateFriendChallengeRequest
): Promise<import('../types/challenge.types').FriendChallengeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  if (!response.ok) {
    if (response.status === 401) {
      throw new ChallengeServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    let errorCode = '';
    let errorMessage = '';
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      errorCode = body.error ?? '';
      errorMessage = body.message ?? '';
    } catch {
      // ignore
    }
    throw new ChallengeServiceError(
      errorMessage || `Erro ao criar desafio (HTTP ${response.status}).`,
      response.status
    );
  }
  return (await response.json()) as import('../types/challenge.types').FriendChallengeResponse;
}

export async function joinFriendChallenge(
  token: string,
  inviteCode: string
): Promise<import('../types/challenge.types').FriendChallengeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/join`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ inviteCode }),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  if (!response.ok) {
    if (response.status === 401) {
      throw new ChallengeServiceError('Sessao expirada. Faca login novamente.', 401);
    }
    let errorMessage = '';
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      errorMessage = body.message ?? '';
    } catch {
      // ignore
    }
    throw new ChallengeServiceError(
      errorMessage || `Erro ao entrar no desafio (HTTP ${response.status}).`,
      response.status
    );
  }
  return (await response.json()) as import('../types/challenge.types').FriendChallengeResponse;
}

export async function getFriendChallenges(
  token: string
): Promise<import('../types/challenge.types').FriendChallengeResponse[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<import('../types/challenge.types').FriendChallengeResponse[]>(response);
}

export async function getFriendChallengeDetail(
  token: string,
  id: string
): Promise<import('../types/challenge.types').FriendChallengeResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${id}`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<import('../types/challenge.types').FriendChallengeResponse>(response);
}

async function handleFriendChallengeCommandResponse(
  response: Response,
  fallbackMessage: string
): Promise<void> {
  if (response.ok) {
    return;
  }

  let errorMessage = '';
  try {
    const body = (await response.json()) as { message?: string };
    errorMessage = body.message ?? '';
  } catch {
    // Use a focused fallback when the error body is absent.
  }

  if (response.status === 401) {
    throw new ChallengeServiceError('Sessao expirada. Faca login novamente.', 401);
  }
  if (response.status === 403) {
    throw new ChallengeServiceError(errorMessage || 'Voce nao pode realizar esta acao.', 403);
  }
  if (response.status === 404) {
    throw new ChallengeServiceError(errorMessage || 'Desafio nao encontrado.', 404);
  }
  if (response.status === 400 || response.status === 409) {
    throw new ChallengeServiceError(errorMessage || fallbackMessage, response.status);
  }
  throw new ChallengeServiceError(
    errorMessage || `${fallbackMessage} (HTTP ${response.status}).`,
    response.status
  );
}

export async function leaveFriendChallenge(token: string, challengeId: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${challengeId}/participants/me`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  await handleFriendChallengeCommandResponse(response, 'Nao foi possivel sair deste desafio.');
}

export async function deleteFriendChallenge(token: string, challengeId: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${challengeId}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  await handleFriendChallengeCommandResponse(response, 'Nao foi possivel excluir este desafio.');
}

export async function registerCheckIn(
  token: string,
  challengeId: string,
  req: RegisterCheckInRequest
): Promise<CheckInResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${challengeId}/check-ins`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(req),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  if (!response.ok) {
    if (response.status === 409) {
      throw new ChallengeServiceError(
        'Voce ja registrou um check-in neste dia.',
        409
      );
    }
    if (response.status === 403) {
      throw new ChallengeServiceError(
        'Voce nao e participante deste desafio ou ele esta em periodo de auditoria.',
        403
      );
    }
    return handleResponse<CheckInResponse>(response);
  }
  return handleResponse<CheckInResponse>(response);
}

export async function getCheckIns(
  token: string,
  challengeId: string
): Promise<CheckInWithUserNameResponse[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${challengeId}/check-ins`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<CheckInWithUserNameResponse[]>(response);
}

export async function rejectCheckIn(
  token: string,
  challengeId: string,
  checkInId: string
): Promise<CheckInResponse> {
  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/friend-challenges/${challengeId}/check-ins/${checkInId}/reject`,
      {
        method: 'PATCH',
        headers: authHeaders(token),
      }
    );
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  if (!response.ok) {
    let errorCode = '';
    let errorMessage = '';
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      errorCode = body.error ?? '';
      errorMessage = body.message ?? '';
    } catch {
      // Ignore malformed error responses and use the fallback messages below.
    }
    if (response.status === 403) {
      throw new ChallengeServiceError(
        errorMessage || 'Apenas o criador pode rejeitar check-ins durante a auditoria.',
        403
      );
    }
    if (response.status === 404) {
      throw new ChallengeServiceError(errorMessage || 'Check-in nao encontrado.', 404);
    }
    if (response.status === 409 || response.status === 422) {
      const fallback = errorCode === 'challenge_not_in_audit'
        ? 'O periodo de auditoria deste desafio foi encerrado.'
        : 'Este check-in ja foi rejeitado.';
      throw new ChallengeServiceError(errorMessage || fallback, response.status);
    }
    throw new ChallengeServiceError(
      errorMessage || `Erro ao rejeitar check-in (HTTP ${response.status}).`,
      response.status
    );
  }
  return handleResponse<CheckInResponse>(response);
}

export async function getChallengeRanking(
  token: string,
  challengeId: string
): Promise<RankingResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/friend-challenges/${challengeId}/ranking`, {
      method: 'GET',
      headers: authHeaders(token),
    });
  } catch {
    throw new ChallengeServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }
  return handleResponse<RankingResponse>(response);
}

export const challengeService = {
  async getMyChallenge(token: string): Promise<IndividualChallenge | null> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/challenges/me`, {
        method: 'GET',
        headers: authHeaders(token),
      });
    } catch {
      throw new ChallengeServiceError(
        'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
      );
    }

    if (response.status === 204) {
      return null;
    }

    return mapIndividualChallenge(await handleResponse<IndividualChallengeApiResponse>(response));
  },
};

export const friendChallengeService = {
  async list(token: string): Promise<FriendChallenge[]> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/friend-challenges`, {
        method: 'GET',
        headers: authHeaders(token),
      });
    } catch {
      throw new ChallengeServiceError(
        'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
      );
    }

    const challenges = await handleResponse<FriendChallengeApiResponse[]>(response);
    return challenges.map(mapFriendChallenge);
  },

  async getDetail(token: string, id: string): Promise<ChallengeDetail> {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/friend-challenges/${id}`, {
        method: 'GET',
        headers: authHeaders(token),
      });
    } catch {
      throw new ChallengeServiceError(
        'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
      );
    }

    return mapChallengeDetail(await handleResponse<ChallengeDetailApiResponse>(response));
  },

  async joinByCode(token: string, code: string): Promise<void> {
    await joinFriendChallenge(token, code);
  },

  async leave(token: string, id: string): Promise<void> {
    await leaveFriendChallenge(token, id);
  },

  async delete(token: string, id: string): Promise<void> {
    await deleteFriendChallenge(token, id);
  },

  async rejectCheckIn(token: string, challengeId: string, checkInId: string): Promise<void> {
    await rejectCheckIn(token, challengeId, checkInId);
  },
};
