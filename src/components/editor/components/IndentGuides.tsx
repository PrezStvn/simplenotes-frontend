import { useEffect, useState } from 'react';

interface IndentGuidesProps {
  content: string;
  indentLevels: number[];
  INDENT_SIZE: number;
}

export const IndentGuides = ({ content, indentLevels, INDENT_SIZE }: IndentGuidesProps) => {
  const [guides, setGuides] = useState<number[]>(indentLevels);

  useEffect(() => {
    // Recalculate guides whenever indentLevels changes
    const initialIndents = content.split('\n').map(line => {
      const leadingSpaces = line.match(/^[ ]*/)?.[0]?.length || 0;
      return Math.floor(leadingSpaces / INDENT_SIZE);
    });

    setGuides(indentLevels.length ? indentLevels : initialIndents);
  }, [content, indentLevels, INDENT_SIZE]);

  return (
    <div className="absolute top-4 left-[1rem] h-full w-full pointer-events-none z-10">
      {guides.map((level, index) => (
        level > 0 && Array.from({ length: level }).map((_, i) => (
          <div
            key={`${index}-${i}`}
            className="absolute w-px bg-blue-400/20"
            style={{ 
              left: `${(i) * INDENT_SIZE * 0.6}rem`,
              top: `${index * 1.6}rem`,
              height: '1.6rem'
            }}
          />
        ))
      ))}
    </div>
  );
}; 