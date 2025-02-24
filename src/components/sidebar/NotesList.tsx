import { useEffect } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { useAuth } from '../../contexts/AuthContext';

export default function NotesList() {
  console.log('NotesList component mounting');
  const { notes, currentNote, setCurrentNote, createNote } = useNotes();
  const { logout } = useAuth();

  const handleNewNote = async () => {
    const newNote = await createNote('Untitled', '');
    setCurrentNote(newNote);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-editor-border flex justify-between items-center">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editor-text/70">
          Notes
        </h2>
        <button
          onClick={logout}
          className="text-sm text-editor-text/50 hover:text-editor-text"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setCurrentNote(note)}
            className={`group px-3 py-2 cursor-pointer
                      ${note.id === currentNote?.id 
                        ? 'bg-editor-active' 
                        : 'hover:bg-editor-hover'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm truncate">
                {note.title || 'Untitled'}
              </span>
              <span className="text-xs text-editor-text/50">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-editor-border">
        <button
          onClick={handleNewNote}
          className="w-full py-1.5 px-3 bg-editor-accent hover:bg-editor-accent/90
                   text-white rounded-sm text-sm font-medium
                   transition-colors duration-150"
        >
          New Note
        </button>
      </div>
    </div>
  );
} 