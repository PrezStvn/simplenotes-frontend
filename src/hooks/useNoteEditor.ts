import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { Note } from '../types';

interface UseNoteEditorProps {
  onSave?: () => void;
}

export const useNoteEditor = ({ onSave }: UseNoteEditorProps) => {
  const { currentNote, updateNote, createNote } = useNotes();
  const [title, setTitle] = useState(currentNote?.title || '');
  const [content, setContent] = useState(currentNote?.content || '');
  const [isEdited, setIsEdited] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [indentLevels, setIndentLevels] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSaveRef = useRef(new Date());
  const INDENT_SIZE = 4;
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
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      setIsPreview(!isPreview);
    }

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
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = 
            lineStart + (newIndent * INDENT_SIZE);
        }
      }, 0);
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const currentLine = content.slice(0, start).split('\n').length - 1;
      
      // Get current indent level
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
      newIndentLevels[currentLine + 1] = currentIndent;  // Set next line's indent
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

  return {
    title,
    content,
    isEdited,
    isPreview,
    lineCount,
    indentLevels,
    textareaRef,
    INDENT_SIZE,
    setIsPreview,
    handleContentChange,
    handleKeyDown,
    handleSave,
    setTitle,
    setIsEdited
  };
}; 