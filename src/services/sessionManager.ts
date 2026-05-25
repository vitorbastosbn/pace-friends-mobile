import * as SecureStore from 'expo-secure-store';
import type { SessionData, UserData } from '../types/auth';

const KEYS = {
  TOKEN: 'pace_token',
  USER_ID: 'pace_user_id',
  USER_NAME: 'pace_user_name',
  USER_EMAIL: 'pace_user_email',
  USER_PHOTO_URL: 'pace_user_photo_url',
} as const;

export async function saveSession(data: SessionData): Promise<void> {
  await SecureStore.setItemAsync(KEYS.TOKEN, data.token);
  await SecureStore.setItemAsync(KEYS.USER_ID, data.user.id);
  await SecureStore.setItemAsync(KEYS.USER_NAME, data.user.name);
  await SecureStore.setItemAsync(KEYS.USER_EMAIL, data.user.email);
  if (data.user.photoUrl) {
    await SecureStore.setItemAsync(KEYS.USER_PHOTO_URL, data.user.photoUrl);
  }
}

export async function getSession(): Promise<SessionData | null> {
  const token = await SecureStore.getItemAsync(KEYS.TOKEN);
  const id = await SecureStore.getItemAsync(KEYS.USER_ID);
  const name = await SecureStore.getItemAsync(KEYS.USER_NAME);
  const email = await SecureStore.getItemAsync(KEYS.USER_EMAIL);
  const photoUrl = await SecureStore.getItemAsync(KEYS.USER_PHOTO_URL);

  if (!token || !id || !name || !email) {
    return null;
  }

  const user: UserData = {
    id,
    name,
    email,
    photoUrl: photoUrl ?? undefined,
  };

  return { token, user };
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.TOKEN);
  await SecureStore.deleteItemAsync(KEYS.USER_ID);
  await SecureStore.deleteItemAsync(KEYS.USER_NAME);
  await SecureStore.deleteItemAsync(KEYS.USER_EMAIL);
  await SecureStore.deleteItemAsync(KEYS.USER_PHOTO_URL);
}

/**
 * Decodes the JWT payload and checks the `exp` field.
 * Does NOT verify the signature — the secret resides only on the backend.
 * Returns true if the token is expired or cannot be decoded.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    // Base64url to base64
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // Pad to multiple of 4
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = atob(padded);
    const payload = JSON.parse(decoded) as Record<string, unknown>;

    if (typeof payload.exp !== 'number') {
      return true;
    }

    const nowInSeconds = Date.now() / 1000;
    return payload.exp < nowInSeconds;
  } catch {
    return true;
  }
}
