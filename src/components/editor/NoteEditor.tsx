import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { useNotes } from '../../contexts/NotesContext';

interface NoteEditorProps {
  onSave?: () => void;
}

export default function NoteEditor({ onSave }: NoteEditorProps) {
  const { currentNote, updateNote, createNote } = useNotes();
  const [title, setTitle] = useState(currentNote?.title || '');
  const [content, setContent] = useState(currentNote?.content || '');
  const [isEdited, setIsEdited] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [indentLevels, setIndentLevels] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSaveRef = useRef(new Date());
  const INDENT_SIZE = 4; // 4 spaces per level
  const MAX_INDENT = 8;

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setIsEdited(false);
    }
  }, [currentNote]);

  useEffect(() => {
    if (!isEdited) return;

    const autoSaveInterval = setInterval(() => {
      if (isEdited && new Date().getTime() - lastSaveRef.current.getTime() > 30000) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [isEdited, content, title]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsPreview(!isPreview);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreview, content, title]);

  const handleSave = async () => {
    try {
      if (currentNote) {
        await updateNote(currentNote.id, title, content, indentLevels);
      } else {
        await createNote(title, content, indentLevels);
      }
      setIsEdited(false);
      lastSaveRef.current = new Date();
      onSave?.();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldLineCount = content.split('\n').length;
    const newLineCount = newContent.split('\n').length;
    
    // If we've lost a line, find which one and remove its indent
    if (newLineCount < oldLineCount) {
      const currentPos = e.target.selectionStart;
      const removedLine = content.slice(0, currentPos).split('\n').length - 1;
      
      const newIndentLevels = [...indentLevels];
      const numLinesToRemove = oldLineCount - newLineCount;
      newIndentLevels.splice(removedLine, numLinesToRemove);

      // For line 0, calculate actual indentation
      if (removedLine === 0) {
        const leadingSpaces = newContent.match(/^[ ]*/)?.[0]?.length || 0;
        newIndentLevels[0] = Math.floor(leadingSpaces / INDENT_SIZE);
      }
      
      setIndentLevels(newIndentLevels);
    }
    
    setContent(newContent);
    setIsEdited(true);
    setLineCount(newLineCount);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      
      // Get current line number
      const currentLine = content.slice(0, start).split('\n').length - 1;
      
      // Calculate new indent level
      const currentIndent = indentLevels[currentLine] || 0;
      const newIndent = e.shiftKey 
        ? Math.max(0, currentIndent - 1)
        : Math.min(MAX_INDENT, currentIndent + 1);
      
      // Update indent levels
      const newIndentLevels = [...indentLevels];
      newIndentLevels[currentLine] = newIndent;
      setIndentLevels(newIndentLevels);

      // Insert spaces at start of line
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const newContent = 
        content.slice(0, lineStart) + 
        ' '.repeat(newIndent * INDENT_SIZE) +
        content.slice(lineStart).trimStart();
      
      setContent(newContent);
      setIsEdited(true);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const currentLine = content.slice(0, start).split('\n').length - 1;
      
      // Log for debugging
      console.log('Current line:', currentLine);
      console.log('Indent levels:', indentLevels);
      console.log('Current indent:', indentLevels[currentLine]);
      
      // Get current indent level, default to 0 if undefined
      const currentIndent = indentLevels[currentLine] || 0;
      
      // Add new line with same indentation
      const newContent = 
        content.slice(0, start) + 
        '\n' + 
        ' '.repeat(currentIndent * INDENT_SIZE) +
        content.slice(start);
      
      setContent(newContent);
      
      // Update indent levels array
      const newIndentLevels = [...indentLevels];
      newIndentLevels[currentLine+1] = currentIndent;  // Set next line's indent
      setIndentLevels(newIndentLevels);
      
      setIsEdited(true);
      
      // Move cursor
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + 1 + (currentIndent * INDENT_SIZE);
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        }
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Title bar with controls */}
      <div className="px-4 py-2 border-b border-editor-border flex items-center justify-between">
        <div className="flex items-center flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsEdited(true);
            }}
            className="bg-transparent border-none outline-none text-lg 
                     text-editor-text placeholder-editor-text/50 w-full"
            placeholder="Untitled Note"
          />
          {isEdited && (
            <span className="text-sm text-editor-text/50 ml-2">•</span>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1 rounded text-sm font-medium
                     bg-editor-border/30 text-editor-text/70 hover:bg-editor-border/50"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={!isEdited}
            className={`px-3 py-1 rounded text-sm font-medium
                     transition-colors duration-150
                     ${isEdited 
                       ? 'bg-editor-accent hover:bg-editor-accent/90 text-white' 
                       : 'bg-editor-border/30 text-editor-text/50 cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-auto flex">
        {/* Line numbers */}
        {!isPreview && (
          <div className="py-4 px-2 text-right text-editor-text/30 select-none bg-editor-sidebar font-mono">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Content area */}
        {isPreview ? (
          <div 
            className="w-full p-4 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent p-4 resize-none outline-none
                     font-mono text-editor-text placeholder-editor-text/50
                     leading-relaxed"
            placeholder="Start typing your note..."
            spellCheck="false"
          />
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-1 text-xs text-editor-text/50 border-t border-editor-border flex justify-between items-center">
        <span>
          {isEdited ? 'Unsaved changes' : 'All changes saved'} • 
          {' '}{content.split(/\s+/).filter(Boolean).length} words • 
          {' '}{lineCount} lines
        </span>
        <span>
          {isPreview ? 'Preview Mode' : 'Edit Mode'}
        </span>
      </div>
    </div>
  );
} 