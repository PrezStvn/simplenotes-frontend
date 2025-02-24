import api from './axios';
import { Note } from '../types';

export const notesApi = {
  getAllNotes: async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  createNote: async (note: { title: string; content: string }): Promise<Note> => {
    const response = await api.post<Note>('/notes', note);
    return response.data;
  },

  updateNote: async (id: string, note: { title: string; content: string }): Promise<Note> => {
    const response = await api.put<Note>(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
}; 