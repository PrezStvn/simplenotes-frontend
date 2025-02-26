interface LineNumbersProps {
  count: number;
}

export const LineNumbers = ({ count }: LineNumbersProps) => (
  <div className="py-4 px-2 text-right text-editor-text/30 select-none bg-editor-sidebar font-mono">
    {Array.from({ length: count }, (_, i) => (
      <div key={i + 1} className="leading-relaxed">
        {i + 1}
      </div>
    ))}
  </div>
); 