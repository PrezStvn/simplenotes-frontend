import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';

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
  const INDENT_SIZE = 2;
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
    
    // Handle line removal
    if (newLineCount < oldLineCount) {
      const currentPos = e.target.selectionStart;
      const removedLine = Math.min(
        content.slice(0, currentPos).split('\n').length,
        oldLineCount - 1  // Ensure we don't exceed array bounds
      );
      
      setIndentLevels(prevLevels => {
        // Ensure we don't remove more lines than we have
        const numLinesToRemove = Math.min(
          oldLineCount - newLineCount,
          prevLevels.length - removedLine
        );
        
        if (numLinesToRemove <= 0 || removedLine >= prevLevels.length) {
          return prevLevels.slice(0, newLineCount);
        }
        
        const newIndentLevels = [...prevLevels];
        newIndentLevels.splice(removedLine, numLinesToRemove);
        return newIndentLevels.slice(0, newLineCount);
      });
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
      
      // Directly update the indent level for the current line
      setIndentLevels(prevLevels => {
        const updatedLevels = [...prevLevels];
        updatedLevels[currentLine] = newIndent;
        // Truncate array to match actual content length
        return updatedLevels.slice(0, content.split('\n').length);
      });

      // Insert spaces at start of line
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const newContent = 
        content.slice(0, lineStart) + 
        ' '.repeat(newIndent * INDENT_SIZE) +
        content.slice(lineStart).trimStart();
      
      setContent(newContent);
      setIsEdited(true);
      setLineCount(newContent.split('\n').length);
      
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
      
      const newLineCount = newContent.split('\n').length;
      
      setContent(newContent);
      setIsEdited(true);
      setLineCount(newLineCount);
      
      // Update indent levels array - shift all subsequent levels up by one
      setIndentLevels(prevLevels => {
        const updatedLevels = [...prevLevels];
        // Insert the new line's indent level and shift everything after it
        updatedLevels.splice(currentLine + 1, 0, currentIndent);
        // Truncate array to match actual content length
        return updatedLevels.slice(0, newLineCount);
      });
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + 1 + (currentIndent * INDENT_SIZE);
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        }
      }, 0);
    }

    if (e.key === 'Backspace') {
      const start = e.currentTarget.selectionStart;
      const currentLine = content.slice(0, start).split('\n').length - 1;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = content.indexOf('\n', start);
      const nextLineContent = lineEnd === -1 ? '' : content.slice(lineEnd);
      
      // Only handle indentation reduction within a line
      if (start > lineStart && 
          content.slice(lineStart, start).trim() === '' && 
          content[start - 1] === ' ') {
        e.preventDefault();
        
        const currentIndent = indentLevels[currentLine] || 0;
        const newIndent = Math.max(0, currentIndent - 1);
        
        // Update content, only trimming the current line
        const newContent = 
          content.slice(0, lineStart) + 
          ' '.repeat(newIndent * INDENT_SIZE) +
          content.slice(lineStart, lineEnd).trimStart() +
          nextLineContent;
        
        setContent(newContent);
        setIsEdited(true);
        
        // Update indent level for current line
        setIndentLevels(prevLevels => {
          const updatedLevels = [...prevLevels];
          updatedLevels[currentLine] = newIndent;
          return updatedLevels.slice(0, newContent.split('\n').length);
        });
        
        // Update cursor position
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = lineStart + (newIndent * INDENT_SIZE);
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
      }
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