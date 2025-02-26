interface TitleBarProps {
  title: string;
  isEdited: boolean;
  isPreview: boolean;
  onTitleChange: (title: string) => void;
  onPreviewToggle: () => void;
  onSave: () => void;
}

export const TitleBar = ({ title, isEdited, isPreview, onTitleChange, onPreviewToggle, onSave }: TitleBarProps) => (
  <div className="px-4 py-2 border-b border-editor-border flex items-center justify-between">
    <div className="flex items-center flex-1">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="bg-transparent border-none outline-none text-lg 
                 text-editor-text placeholder-editor-text/50 w-full"
        placeholder="Untitled Note"
      />
      {isEdited && (
        <span className="text-sm text-editor-text/50 ml-2">•</span>
      )}
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={onPreviewToggle}
        className="px-3 py-1 rounded text-sm font-medium
                 bg-editor-border/30 text-editor-text/70 hover:bg-editor-border/50"
      >
        {isPreview ? 'Edit' : 'Preview'}
      </button>
      <button
        onClick={onSave}
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
); 