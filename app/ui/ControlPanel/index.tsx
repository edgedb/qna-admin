"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SSE } from "sse.js";
import Input from "../Input";
import IconButton from "../IconButton";
import { Code } from "../Code";
import { CopiedIcon, EditIcon, UndoIcon } from "@/app/ui/icons";
import {
  QNASummary,
  formatQNASummary,
  parseQNASummary,
  dbUpdate,
} from "@/app/lib/utils";
import PromptBoxModal from "../PromptBoxModal";
import ParsedControls from "./ParsedControls";
import { deleteDraftAction, publishQNAAction } from "./actions";
import PublishModal from "../PublishModal";
import { type DraftT, dbUpsertDraft } from "@/app/lib/db/drafts";

interface ControlPanelProps {
  draft: NonNullable<DraftT>;
  tagsOptions: string[];
  defaultPrompt: string;
}

export default function ControlPanel({
  draft,
  tagsOptions,
  defaultPrompt,
}: ControlPanelProps) {
  const { thread } = draft;

  const [prompt, setPrompt] = useState<string>(draft.prompt ?? defaultPrompt);
  const [promptOpen, setPromptOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [parsed, setParsed] = useState(tryParse(draft));
  const [parseFailed, setParseFailed] = useState(false);

  const [summarized, setSummarized] = useState(
    draft.title && draft.question && draft.answer
      ? formatQNASummary({
          title: draft.title,
          answer: draft.answer,
          question: draft.question,
          tags: draft.tags ?? [],
        })
      : undefined
  );
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(summarized);

  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const onPromptChange = async (value: string) => {
    if (prompt === value) {
      return setPromptOpen(false);
    }

    try {
      await dbUpdate(dbUpsertDraft(thread.id, { prompt: value }), {
        pending: "Updating prompt...",
        success: "Prompt updated!",
        error: "Failed to change prompt.",
      });

      setPrompt(value);
      setPromptOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const onGenerate = () => {
    setSummarized("");
    setIsGenerating(true);

    const eventSource = new SSE(`/api/generate`, {
      payload: JSON.stringify({
        uiPrompt: prompt,
        id: thread.id,
      }),
    });

    eventSource.onmessage = (message) => {
      if (message.data === "[DONE]") {
        return setIsGenerating(false);
      }

      try {
        const completionResponse = JSON.parse(message.data);
        const text = completionResponse.choices[0].delta?.content || "";
        setSummarized((sum) => (sum ?? "") + text);
      } catch (err: any) {
        console.warn("SSE error", err);
      }
    };

    eventSource.onerror = (err) => {
      setSummarized(`Failed to generate: ${err.type}`);
      setIsGenerating(false);
      console.error("Generation failed", err);
    };

    eventSource.stream();
  };

  const parseSummary = async () => {
    try {
      // try to parse
      const parsed = parseQNASummary(summarized!);

      if (!parsed) {
        setParseFailed(true);
        return;
      }

      setParseFailed(false);

      await dbUpdate(dbUpsertDraft(thread.id, parsed), {
        pending: "Updating draft...",
        success: "Draft updated!",
        error: "Failed to update draft.",
      });

      setParsed({ ...parsed });
    } catch (err: any) {
      // we don't really need to do anything since the toast proxies the fetch, so
      // this catch block is really just to not set summarized.
      console.error(err);
    }
  };

  const updateDraft = async (content: Partial<QNASummary>) => {
    try {
      await dbUpdate(dbUpsertDraft(thread.id, content), {
        pending: "Updating draft...",
        success: "Draft updated!",
        error: "Failed to update draft.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveSummaryEdit = () => {
    if (summarized !== editedContent) {
      setSummarized(editedContent);
    }
    setEditing(false);
  };

  const publishQNA = async (content: any) => {
    try {
      await dbUpdate(publishQNAAction({ ...content, draftId: draft.id }), {
        pending: "Publishing QNA...",
        success: "QNA published!",
        error: "Failed to create QNA.",
      });
      setPublishModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  async function deleteDraft() {
    try {
      await dbUpdate(deleteDraftAction(draft.id), {
        pending: "Deleting draft...",
        success: "Draft deleted!",
        error: "Failed to delete draft.",
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded flex flex-col bg-transparent mt-7">
      <PromptBoxModal
        open={promptOpen}
        value={prompt}
        onChange={onPromptChange}
        onClose={() => setPromptOpen(false)}
      />

      <div className="bg-element p-4 pb-2 rounded">
        <div className="flex gap-2">
          <div className="grow flex gap-2">
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#277e94] hover:bg-[#2f98b3] disabled:bg-[#1c5c6c]"
              onClick={onGenerate}
            >
              {summarized ? "REGENERATE" : "GENERATE"}
            </button>
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#55585e] hover:bg-placeholder disabled:bg-[#35373a]"
              onClick={() => setPromptOpen(true)}
            >
              PROMPT
            </button>
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-accentRed hover:bg-hoverRed"
              onClick={deleteDraft}
            >
              DELETE
            </button>
          </div>

          <div className="">
            {editing ? (
              <div className="flex gap-0.5">
                {summarized !== editedContent && (
                  <IconButton
                    onClick={() => setEditedContent(summarized)}
                    icon={<UndoIcon />}
                    className="text-accentOrange hover:text-hoverOrange"
                  />
                )}
                <IconButton
                  icon={<CopiedIcon />}
                  onClick={saveSummaryEdit}
                  className="text-accentGreen hover:text-hoverGreen"
                />
              </div>
            ) : (
              <div className="flex gap-0.5 h-7">
                <button
                  className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#277e94] hover:bg-[#2f98b3] disabled:bg-[#1c5c6c] mr-1.5"
                  disabled={!summarized}
                  onClick={parseSummary}
                >
                  PARSE
                </button>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditedContent(summarized);
                    setEditing(true);
                  }}
                  disabled={!summarized}
                  className="text-accentOrange hover:text-hoverOrange -mt-0.5 disabled:text-disabledOrange"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 min-h-[300px]">
          <h4 className="text-sm mb-6">
            {summarized
              ? "GPT ANSWER"
              : "WHEN YOU CLICK GENERATE THE GPT ANSWER WILL SHOW UP BELOW"}
          </h4>
          {editing ? (
            <Input
              className=""
              value={editedContent ?? ""}
              onChange={setEditedContent}
            />
          ) : (
            <>
              {summarized && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ inline, className, children }) => (
                      <Code
                        code={(children || "").toString()}
                        language={className?.replace(/^language-/, "") ?? ""}
                        inline={inline}
                      />
                    ),
                  }}
                >
                  {summarized}
                </ReactMarkdown>
              )}
            </>
          )}
        </div>
      </div>
      <div className="bg-element mt-4 rounded text-text">
        {parsed && (
          <PublishModal
            onCancel={() => setPublishModalOpen(false)}
            onPublish={publishQNA}
            parsed={parsed}
            open={publishModalOpen}
          />
        )}
        <div className="min-h-[400px]">
          <div className="flex justify-between px-4 pt-4">
            <p className="text-title text-sm">PARSED CONTENT</p>
            <div className="flex gap-2">
              <button
                disabled={!parsed}
                className="outline-none border-none text-black py-1 h-fit px-2 text-xs rounded bg-accentGreen hover:bg-hoverGreen disabled:bg-[#175745]"
                onClick={() => setPublishModalOpen(true)}
              >
                PUBLISH
              </button>
            </div>
          </div>

          {parseFailed ? (
            <div className="text-accentRed ml-4">
              Result not parsed. Try again.
            </div>
          ) : (
            parsed && (
              <ParsedControls
                parsed={parsed}
                onChange={updateDraft}
                className="mt-4"
                tagsOptions={tagsOptions}
                isDraft={true}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

const tryParse = (draft: NonNullable<DraftT>): QNASummary | undefined => {
  if (draft.title && draft.question && draft.answer) {
    return {
      answer: draft.answer,
      question: draft.question,
      title: draft.title,
      tags: draft.tags || [],
    };
  }
};
