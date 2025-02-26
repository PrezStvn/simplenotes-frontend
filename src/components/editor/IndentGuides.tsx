interface IndentGuidesProps {
  content: string;
  indentLevels: number[];
  INDENT_SIZE: number;
}

export const IndentGuides = ({ content, indentLevels, INDENT_SIZE }: IndentGuidesProps) => (
  <div className="absolute top-4 left-[3rem] h-full pointer-events-none">
    {content.split('\n').map((_, index) => (
      <div key={index} className="relative h-[1.5rem]">
        {Array.from({ length: indentLevels[index] || 0 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-editor-text/10"
            style={{ 
              left: `${(i + 1) * INDENT_SIZE * 0.5}rem`,
              height: '1.5rem'
            }}
          />
        ))}
      </div>
    ))}
  </div>
); 