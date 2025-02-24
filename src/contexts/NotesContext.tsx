import { createContext, useContext, useState, ReactNode } from 'react';
import { Note } from '../types';
import { notesApi } from '../api/notes';

interface NotesContextType {
  notes: Note[];
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;
  createNote: (title: string, content: string) => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    console.log('fetchNotes called from NotesContext');
    const fetchedNotes = await notesApi.getAllNotes();
    setNotes(fetchedNotes);
  };

  const createNote = async (title: string, content: string) => {
    const newNote = await notesApi.createNote({ title, content });
    setNotes([...notes, newNote]);
    return newNote;
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const updatedNote = await notesApi.updateNote(id, { title, content });
    setNotes(notes.map(note => note.id === id ? updatedNote : note));
    return updatedNote;
  };

  const deleteNote = async (id: string) => {
    await notesApi.deleteNote(id);
    setNotes(notes.filter(note => note.id !== id));
    if (currentNote?.id === id) setCurrentNote(null);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      currentNote,
      setCurrentNote,
      createNote,
      updateNote,
      deleteNote,
      fetchNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Export a function to handle post-auth fetch
export const useNotesAfterAuth = () => {
  const { fetchNotes } = useNotes();
  return { fetchNotesAfterAuth: fetchNotes };
}; 