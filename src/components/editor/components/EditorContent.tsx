interface EditorContentProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const EditorContent = ({ content, onChange, onKeyDown, textareaRef }: EditorContentProps) => (
  <textarea
    ref={textareaRef}
    value={content}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className="w-full h-full bg-transparent p-4 resize-none outline-none
             font-mono text-editor-text placeholder-editor-text/50
             leading-relaxed"
    placeholder="Start typing your note..."
    spellCheck="false"
  />
); 