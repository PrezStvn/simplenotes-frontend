import NotesList from '../sidebar/NotesList';
import NoteEditor from '../editor/NoteEditor';
import { useNotesAfterAuth } from '../../contexts/NotesContext';
import { useEffect, useRef } from 'react';

export default function MainLayout() {
  const { fetchNotesAfterAuth } = useNotesAfterAuth();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      fetchNotesAfterAuth();
      mounted.current = true;
    }
  }, []);

  return (
    <div className="h-screen flex bg-editor-bg text-editor-text">
      {/* Sidebar */}
      <aside className="w-64 bg-editor-sidebar border-r border-editor-border">
        <NotesList />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        <NoteEditor />
      </main>
    </div>
  );
} 