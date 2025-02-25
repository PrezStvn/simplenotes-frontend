export interface Note {
  id: string;
  title: string;
  content: string;
  indentation?: number[];  // Array of indentation levels for each line
  createdAt: string;
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