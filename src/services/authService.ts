import type { AuthResponse } from '../types/auth';
import { clearSession } from './sessionManager';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ?? '';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8080/api/v1';

const isPlaceholder = (value: string): boolean =>
  value.includes('YOUR_') || value.trim() === '';

type GoogleSignInModule = typeof import('@react-native-google-signin/google-signin');

let googleSignInModulePromise: Promise<GoogleSignInModule> | null = null;
let configurePromise: Promise<void> | null = null;

/**
 * Thrown when this JavaScript bundle is opened in a client that does not
 * contain the native Google Sign-In module, such as Expo Go.
 */
export class GoogleSignInUnavailableError extends Error {
  constructor() {
    super(
      'Google Sign-In requer um development build; o modulo nativo RNGoogleSignin nao esta disponivel.'
    );
    this.name = 'GoogleSignInUnavailableError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

async function loadGoogleSignIn(): Promise<GoogleSignInModule> {
  if (!googleSignInModulePromise) {
    googleSignInModulePromise = import(
      '@react-native-google-signin/google-signin'
    ).catch(() => {
      googleSignInModulePromise = null;
      throw new GoogleSignInUnavailableError();
    });
  }

  return googleSignInModulePromise;
}

export function configureGoogleSignIn(): Promise<void> {
  if (isPlaceholder(WEB_CLIENT_ID)) {
    console.warn(
      '[authService] EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB is not configured. ' +
        'Google Sign-In will not work until a valid Client ID is provided.'
    );
    return Promise.resolve();
  }

  if (!configurePromise) {
    configurePromise = loadGoogleSignIn().then(({ GoogleSignin }) => {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
      });
    });
  }

  return configurePromise;
}

/**
 * Thrown when the user explicitly cancels the Google sign-in flow.
 */
export class SignInCancelledError extends Error {
  constructor() {
    super('Sign-in cancelled by the user.');
    this.name = 'SignInCancelledError';
  }
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  await configureGoogleSignIn();
  const { GoogleSignin } = await loadGoogleSignIn();

  let signInResult;
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    signInResult = await GoogleSignin.signIn();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new AuthenticationError(`Falha no login Google: ${message}`);
  }

  // v16 uses a discriminated union — cancelled is NOT an exception.
  if (signInResult.type === 'cancelled') {
    throw new SignInCancelledError();
  }

  const idToken = signInResult.data.idToken;
  if (!idToken) {
    throw new Error('idToken ausente na resposta do Google.');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    throw new AuthenticationError(
      `Nao foi possivel conectar ao backend em ${API_BASE_URL}.`
    );
  }

  if (!response.ok) {
    throw new AuthenticationError(
      `O backend recusou o login Google (HTTP ${response.status}).`
    );
  }

  const data = (await response.json()) as AuthResponse;
  return data;
}

export async function signOut(): Promise<void> {
  try {
    const { GoogleSignin } = await loadGoogleSignIn();
    await GoogleSignin.signOut();
  } catch {
    // Local session cleanup should not depend on availability of the SDK.
  } finally {
    await clearSession();
  }
}
