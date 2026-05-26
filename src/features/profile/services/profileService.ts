import type {
  ProfileData,
  UpdateFrequencyResponse,
  UpdateProfileRequest,
} from '../types/profile.types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

export class ProfileServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ProfileServiceError';
  }
}

export async function getProfile(
  userId: string,
  token: string
): Promise<ProfileData> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ProfileServiceError(
      `Nao foi possivel conectar ao servidor. Verifique sua conexao.`
    );
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new ProfileServiceError('Acesso negado.', 403);
    }
    if (response.status === 404) {
      throw new ProfileServiceError('Perfil nao encontrado.', 404);
    }
    throw new ProfileServiceError(
      `Erro ao carregar perfil (HTTP ${response.status}).`,
      response.status
    );
  }

  const data = (await response.json()) as ProfileData;
  return data;
}

export async function updateProfile(
  userId: string,
  token: string,
  request: UpdateProfileRequest
): Promise<ProfileData> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new ProfileServiceError(
      `Nao foi possivel conectar ao servidor. Verifique sua conexao.`
    );
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new ProfileServiceError('Dados invalidos. Verifique as selecoes.', 400);
    }
    if (response.status === 403) {
      throw new ProfileServiceError('Acesso negado.', 403);
    }
    throw new ProfileServiceError(
      `Erro ao salvar perfil (HTTP ${response.status}).`,
      response.status
    );
  }

  const data = (await response.json()) as ProfileData;
  return data;
}

export interface PublicProfileData {
  id: string;
  name: string;
  avatarUrl: string | null;
  totalVictories: number;
  achievementsUnlocked: number;
}

export async function getPublicProfile(userId: string): Promise<PublicProfileData> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}/public`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    throw new ProfileServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ProfileServiceError('Perfil nao encontrado.', 404);
    }
    throw new ProfileServiceError(
      `Erro ao carregar perfil publico (HTTP ${response.status}).`,
      response.status
    );
  }

  return (await response.json()) as PublicProfileData;
}

export async function deleteAccount(
  userId: string,
  token: string
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ProfileServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new ProfileServiceError('Acesso negado.', 403);
    }
    throw new ProfileServiceError(
      `Erro ao excluir conta (HTTP ${response.status}).`,
      response.status
    );
  }
}

export async function updateFrequency(
  token: string,
  weeklyFrequency: number
): Promise<UpdateFrequencyResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/users/me/frequency`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ weeklyFrequency }),
    });
  } catch {
    throw new ProfileServiceError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao.'
    );
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new ProfileServiceError('Escolha uma frequencia entre 1 e 7 dias.', 400);
    }
    throw new ProfileServiceError(
      `Erro ao atualizar frequencia (HTTP ${response.status}).`,
      response.status
    );
  }
  return (await response.json()) as UpdateFrequencyResponse;
}
