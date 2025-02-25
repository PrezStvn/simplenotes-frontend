import api from './axios';
import { Note } from '../types';

interface NoteData {
  title: string;
  content: string;
  indentLevels: number[];
}

export const notesApi = {
  getAllNotes: async (): Promise<Note[]> => {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  createNote: async (note: NoteData): Promise<Note> => {
    const response = await api.post<Note>('/notes', note);
    return response.data;
  },

  updateNote: async (id: string, note: NoteData): Promise<Note> => {
    const response = await api.put<Note>(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
}; 