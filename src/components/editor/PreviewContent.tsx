import { marked } from 'marked';

interface PreviewContentProps {
  content: string;
}

export const PreviewContent = ({ content }: PreviewContentProps) => (
  <div 
    className="w-full p-4 prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: marked(content) }}
  />
); 