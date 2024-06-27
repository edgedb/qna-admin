"use client";

import { useState } from "react";
import PromptBoxModal from "../ui/PromptBoxModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code } from "./Code";
import { dbUpdate, defaultPrompt } from "../lib/utils";
import { useRouter } from "next/navigation";
import { dbAddPrompt, dbUpdatePrompt } from "../lib/db/prompt";

interface PromptPanelProps {
  dbPrompt: {
    id: string;
    content: string;
  } | null;
}
export default function PromptPanel({ dbPrompt }: PromptPanelProps) {
  const [prompt, setPrompt] = useState(dbPrompt?.content || defaultPrompt);
  const [promptOpen, setPromptOpen] = useState(false);
  const router = useRouter();

  const onPromptChange = async (value: string) => {
    if ((!dbPrompt && !value) || (dbPrompt && value === prompt)) {
      return setPromptOpen(false);
    }

    try {
      if (!dbPrompt) {
        await dbUpdate(dbAddPrompt(value), {
          pending: "Adding prompt...",
          success: "Prompt added!",
          error: "Failed to add prompt.",
        });
        router.refresh();
      } else {
        await dbUpdate(dbUpdatePrompt(dbPrompt.id, value), {
          pending: "Updating prompt...",
          success: "Prompt updated!",
          error: "Failed to update prompt.",
        });
      }

      setPrompt(value);
      setPromptOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      {!dbPrompt ? (
        <button
          onClick={() => setPromptOpen(true)}
          className="text-xs py-1 px-2 bg-accentGreen rounded text-black hover:text-black hover:bg-hoverGreen transition-colors mr-2"
        >
          ADD PROMPT
        </button>
      ) : (
        <div className="px-4 max-w-[900px]">
          <button
            onClick={() => setPromptOpen(true)}
            className="text-xs py-1 px-2 bg-accentOrange rounded text-black hover:text-black hover:bg-hoverOrange transition-colors mr-2 mb-4"
          >
            UPDATE PROMPT
          </button>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ inline, className, children }) => {
                return (
                  <Code
                    code={children!.toString()}
                    language={className?.replace(/^language-/, "") ?? ""}
                    inline={inline}
                  />
                );
              },
            }}
          >
            {prompt}
          </ReactMarkdown>
        </div>
      )}
      <PromptBoxModal
        open={promptOpen}
        value={prompt}
        onChange={onPromptChange}
        onClose={() => setPromptOpen(false)}
      />
    </div>
  );
}
