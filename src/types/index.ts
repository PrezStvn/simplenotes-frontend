export interface Note {
  id: string;
  title: string;
  content: string;
  indentLevels: number[]; 
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