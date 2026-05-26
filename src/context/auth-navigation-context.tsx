import { createContext, use } from 'react';

export interface AuthNavigationActions {
  completeSignIn: () => void;
  completeSignOut: () => void;
  completeOnboarding: () => void;
}

const AuthNavigationContext = createContext<AuthNavigationActions | null>(null);

export const AuthNavigationProvider = AuthNavigationContext.Provider;

export function useAuthNavigation(): AuthNavigationActions {
  const context = use(AuthNavigationContext);

  if (!context) {
    throw new Error('useAuthNavigation must be used within AuthNavigationProvider.');
  }

  return context;
}
