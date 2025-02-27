import { useNoteEditor } from '../../hooks/useNoteEditor';
import { TitleBar } from './components/TitleBar';
import { LineNumbers } from './components/LineNumbers';
import { IndentGuides } from './components/IndentGuides';
import { EditorContent } from './components/EditorContent';
import { PreviewContent } from './components/PreviewContent';
import { StatusBar } from './components/StatusBar';

interface NoteEditorProps {
  onSave?: () => void;
}

export default function NoteEditor({ onSave }: NoteEditorProps) {
  const {
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
  } = useNoteEditor({ onSave });

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      <TitleBar 
        title={title}
        isEdited={isEdited}
        isPreview={isPreview}
        onTitleChange={(newTitle) => {
          setTitle(newTitle);
          setIsEdited(true);
        }}
        onPreviewToggle={() => setIsPreview(!isPreview)}
        onSave={handleSave}
      />

      <div className="flex-1 overflow-auto flex relative">
        {!isPreview && <LineNumbers count={lineCount} />}
        
        <div className="relative flex-1">
        {!isPreview && (
          <IndentGuides 
            content={content}
            indentLevels={indentLevels}
            INDENT_SIZE={INDENT_SIZE}
          />
        )}
        
        {isPreview ? (
          <PreviewContent content={content} />
        ) : (
          <EditorContent
            content={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
            />
          )}
        </div>
      </div>

      <StatusBar 
        isEdited={isEdited}
        isPreview={isPreview}
        wordCount={content.split(/\s+/).filter(Boolean).length}
        lineCount={lineCount}
      />
    </div>
  );
} 