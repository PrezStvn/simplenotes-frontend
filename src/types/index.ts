export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 