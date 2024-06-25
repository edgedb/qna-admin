import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code } from "./Code";
import Input from "./Input";

interface EditableMarkdownProps {
  content: string;
  editing: boolean;
  onContentChange: (v: string) => void;
  className?: string;
}

export default function EditableMarkdown({
  editing,
  content,
  onContentChange,
  className,
}: EditableMarkdownProps) {
  return editing ? (
    <Input
      className={className}
      value={content ?? ""}
      onChange={onContentChange}
    />
  ) : (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      components={{
        code: ({ inline, className, children }) => (
          <Code
            code={children.toString()}
            language={className?.replace(/^language-/, "") ?? ""}
            inline={inline}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
