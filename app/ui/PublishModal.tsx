import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ConfirmationModal from "./ConfirmationModal";
import { QNASummary, formatQNASummary } from "@/app/lib/utils";
import { Code } from "./Code";

interface PublishModalProps {
  parsed: QNASummary;
  open: boolean;
  onPublish: (content: QNASummary) => void;
  onCancel: () => void;
}

export default function PublishModal({
  onCancel,
  onPublish,
  open,
  parsed,
}: PublishModalProps) {
  return (
    <ConfirmationModal
      onCancel={onCancel}
      open={open}
      onConfirm={() => onPublish(parsed)}
      className="transition-transform"
    >
      <div className="">
        <h4 className="border-b border-title pb-1">
          Does everything look good?
        </h4>
        <div className="overflow-y-auto max-h-[70vh] pt-4 rounded">
          <ReactMarkdown
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
            {formatQNASummary(parsed)}
          </ReactMarkdown>
        </div>
      </div>
    </ConfirmationModal>
  );
}
