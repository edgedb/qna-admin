"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SSE } from "sse.js";

import Input from "../Input";
// import PromptBoxModal from "../promptBoxModal";
// import Button from "../button";
// import PublishModal from "../publishModal";
import IconButton from "../IconButton";
import { Code } from "../Code";
import { CloseIcon, CopiedIcon, EditIcon } from "@/app/assets/icons";
import {
  QNASummary,
  formatQNASummary,
  parseQNASummary,
  stageUpdate,
} from "../utils";
import { QNADraft } from "@/dbschema/interfaces";
import PromptBoxModal from "../PromptBoxModal";
import { upsertDraft } from "@/app/api/drafts";
import { ToastPromiseParams, toast } from "react-toastify";
import ParsedControls from "./ParsedControls";
import { deleteDraft } from "../actions";
import { revalidatePath, revalidateTag } from "next/cache";

// export const dynamic = "force-dynamic";

interface ControlPanelProps {
  draft: any;
  // onPublish: (content: any) => void;
  // onRegenerate: () => void;
  // disabled: boolean;
  // prompt: string;
  // onPromptChange: (value: string) => void;
  // summary: string | undefined;
  // title: string | undefined;
  // question: string | undefined;
  // answer: string | undefined;
  // tags: string[] | undefined;
  // onChange: (content: any | string) => void;
}

const defaultPrompt = `
Summarize the following conversation into a FAQ with question, answer, title 
and tags. Include markdown when sending code snippets. Make sure to capture the answer
within the following messages and include that in the summarized version.

Use the following format to summarize:
**Title**
...

**Tags**
...

**Question**
...

**Answer**
...`;

export default function ControlPanel({ draft }: ControlPanelProps) {
  const router = useRouter();

  const { id, thread, title, question, answer, tags } = draft;

  const [parsed, setParsed] = useState(tryParse(draft));
  const [parseFailed, setParseFailed] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [threadMessages, setThreadMessages] = useState(thread.messages);

  const [promptOpen, setPromptOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // const [editedContent, setEditedContent] = useState(summary);

  // const [starterMessage, setStarterMessage] = useState(thread.messages[0]);
  // const [threadMessages, setThreadMessages] = useState(thread.messages);

  const [prompt, setPrompt] = useState<string>(draft.prompt ?? defaultPrompt);

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

  //       `**Title**: Understanding Access Policies in EdgeDB

  // **Tags**: EdgeDB, Access Policies, Object-level Security, SQL, Database

  // **Question**: What are access policies and how do they work in EdgeDB?

  // **Answer**: Access policies in EdgeDB are security policies contained in object types that restrict the set of objects that can be selected, inserted, updated, or deleted by a particular query. This is known as object-level security and it is similar in function to SQL’s row-level security.
  // When no access policies are defined, object-level security is not activated. Any properly authenticated client can carry out any operation on any object in the database. Access policies allow us to ensure that the database itself handles this logic, thereby freeing us up from implementing access control in each and every piece of software that accesses the data.
  // Global variables are a convenient way to provide the context needed to determine what sort of access should be allowed for a given object, as they can be set and reset by the application as needed.
  // Here is a schema example with 2 policies:`
  //   );

  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(summarized);

  const summarizedRef = useRef(summarized);
  summarizedRef.current = summarized;

  const handlePublish = () => {};

  const onPromptChange = async (value: string) => {
    setPromptOpen(false);

    if (prompt === value) {
      return;
    }

    try {
      await stageUpdate(upsertDraft(thread.id, { prompt: value }), {
        error: "Failed to change prompt",
        pending: "Updating prompt...",
        success: "Prompt updated!",
      });

      setPrompt(value);
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
        // if (summarizedRef.current) handleSummaryChange(summarizedRef.current); //
        // handleSummaryChange(summarized);
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
      // setSummarized(content);

      // try to parse
      const parsed = parseQNASummary(summarized);

      if (!parsed) {
        setParseFailed(true);
        return;
      }

      setParseFailed(false);

      // await stageUpdate(upsertDraft(thread.id, parsed), {
      //   error: "Failed to update summary",
      //   success: "Summary updated!",
      //   pending: "Updating summary...",
      // });

      setParsed({ ...parsed });
    } catch (err: any) {
      // we don't really need to do anything since the toast proxies the fetch, so
      // this catch block is really just to not set summarized.
      console.error(err);
    }
  };

  // what is this?
  const update = (content: QNASummary | string) => {
    //   // try parse
    //   if (typeof content === "string") {
    //     const result = parseQNASummary(content);
    //     if (result) {
    //       setParsed(parsed);
    //       onChange(result);
    //       return;
    //     }
    //   }
    //   onChange(content);
    //   if (typeof content !== "string") {
    //     setParsed(content);
    //   }
  };

  const cancelSummaryEdit = () => {
    setEditedContent(summarized);
    setEditing(false);
  };

  const saveSummaryEdit = () => {
    setSummarized(editedContent);
    setEditing(false);
  };

  const onUpdateDraft = async () => {
    await stageUpdate(upsertDraft(thread.id, parsed), {
      error: "Failed to save draft",
      pending: "Updating draft...",
      success: "Draft updated!",
    });
  };

  const onPublish = () => {};

  // const searchParams = useSearchParams();

  // const pathname = usePathname();
  // const { replace } = useRouter();

  const del = async () => {
    // const params = new URLSearchParams(searchParams);
    // params.set("query", "");
    await deleteDraft(id);
    // router.push("/drafts");
  };

  return (
    <div className="rounded flex flex-col bg-transparent mt-6 mb-4">
      <PromptBoxModal
        open={promptOpen}
        value={prompt}
        onChange={onPromptChange}
        onClose={() => setPromptOpen(false)}
      />

      <div className="bg-element p-3 pb-0 rounded">
        <div className="flex gap-2">
          <div className="grow flex gap-2">
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#277e94] hover:bg-[#2f98b3] disabled:bg-[#1c5c6c]"
              onClick={onGenerate}
            >
              {parsed ? "REGENERATE" : "GENERATE"}
            </button>
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#424549] hover:bg-[#55585e] disabled:bg-[#35373a]"
              onClick={() => setPromptOpen(true)}
            >
              PROMPT
            </button>
            <button
              disabled={isGenerating}
              className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-accentRed hover:bg-hoverRed"
              onClick={del}
            >
              DELETE
            </button>
          </div>

          <div className="">
            {editing ? (
              <div className="flex gap-0.5">
                <IconButton
                  icon={<CopiedIcon className="mt-1" />}
                  onClick={saveSummaryEdit}
                  className="text-accentGreen hover:text-hoverGreen"
                />
                <IconButton
                  onClick={cancelSummaryEdit}
                  icon={<CloseIcon />}
                  className="text-accentOrange hover:text-hoverOrange"
                />
              </div>
            ) : (
              <div className="flex gap-0.5">
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditedContent(summarized);
                    setEditing(true);
                  }}
                  disabled={!summarized}
                  className="text-accentOrange hover:text-hoverOrange -mt-0.5 disabled:text-disabledOrange"
                />
                <button
                  className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-[#277e94] hover:bg-[#2f98b3] disabled:bg-[#1c5c6c]"
                  disabled={!summarized}
                  onClick={parseSummary}
                >
                  PARSE
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 min-h-[300px]">
          <h4 className="text-sm mb-6 mt-2">
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
                    code: ({ className, children }) => (
                      <Code
                        code={(children || "").toString()}
                        language={className?.replace(/^language-/, "") ?? ""}
                      />
                    ),
                  }}
                  className="px-2.5"
                >
                  {summarized}
                </ReactMarkdown>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-element p-2 mt-4 rounded text-text">
        {/* {parsed && (
          <PublishModal
            onCancel={() => setPublishModalOpen(false)}
            onPublish={onPublish}
            parsed={parsed}
            open={publishModalOpen}
          />
        )} */}
        <div className="flex justify-between ">
          <p className="text-title text-sm">PARSED CONTENT</p>
          <div className="flex gap-2">
            <button
              disabled={isGenerating || parsed === undefined}
              className="outline-none border-none text-black py-1 h-fit px-2 text-xs rounded bg-accentBlue hover:bg-hoverBlue"
              onClick={onUpdateDraft}
            >
              SAVE
            </button>
            <button
              disabled={isGenerating || parsed === undefined}
              className="outline-none border-none text-black py-1 h-fit px-2 text-xs rounded bg-accentGreen hover:bg-hoverGreen disabled:bg-[#175745]"
              onClick={onPublish}
            >
              PUBLISH
            </button>
          </div>
        </div>

        {parseFailed && (
          <div className="text-accentRed">Unable to parse result</div>
        )}

        <ParsedControls parsed={parsed} onChange={update} className="mt-4" />
      </div>
    </div>
  );
}

const tryParse = (draft: QNADraft): QNASummary => {
  // if (draft.answer && draft.question && draft.title && draft.tags) {
  return {
    answer: draft.answer || "",
    question: draft.question || "",
    title: draft.title || "",
    tags: draft.tags || [],
  };
};
// };
