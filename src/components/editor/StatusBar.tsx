interface StatusBarProps {
  isEdited: boolean;
  isPreview: boolean;
  wordCount: number;
  lineCount: number;
}

export const StatusBar = ({ isEdited, isPreview, wordCount, lineCount }: StatusBarProps) => (
  <div className="px-4 py-1 text-xs text-editor-text/50 border-t border-editor-border flex justify-between">
    <div>
      {isEdited && <span>Unsaved changes • </span>}
      <span>{isPreview ? 'Preview' : 'Editing'}</span>
    </div>
    <div>
      <span>{lineCount} lines • </span>
      <span>{wordCount} words</span>
    </div>
  </div>
); 