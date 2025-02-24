import api from './axios';

interface AuthResponse {
  token: string;
  email: string;
}

interface Credentials {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },
}; 