export interface UserData {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface SessionData {
  token: string;
  user: UserData;
}
