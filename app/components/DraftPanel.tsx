// import { toast, ToastContainer, ToastPromiseParams } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import Thread from "./Thread";
import ControlPanel from "./ControlPanel";
import { QNADraft } from "@/dbschema/interfaces";
import { formatQNASummary, QNASummary, stageUpdate } from "./utils";
import { auth } from "../edgedb";
import { redirect } from "next/navigation";

export default function DraftPanel({ draft }: { draft: any }) {
  const { thread } = draft;

  // const [parseFailed, setParseFailed] = useState(false);
  // const [parsed, setParsed] = useState(tryParse(draft));
  // const [isGenerating, setIsGenerating] = useState(false);
  // const [starterMessage, setStarterMessage] = useState(thread.messages[0]);
  // const [threadMessages, setThreadMessages] = useState(thread.messages);
  // const [messageVisibility, setMessageVisibility] = useState<
  //   Map<string, boolean>
  // >(new Map<string, boolean>());
  // const [prompt, setPrompt] = useState<string>(
  //   draft.prompt ??
  //     `Summarize the following conversation into a FAQ like question and answer,
  //     generalize the question and answer based off of the relative information
  //     provided while linking to any relevant documentation when applicable,
  //     include markdown when sending code snippets. Make sure to capture the answer
  //     within the following messages and include that in the summarized version.

  // Use the following format to summarize, generate a relevant title and tags:
  // **Title**
  // ...

  // **Tags**
  // ...

  // **Question**
  // ...

  // **Answer**
  // ...`
  // );

  // const [summarized, setSummarized] = useState<string | undefined>(
  //   draft.answer && draft.question
  //     ? formatQNASummary({
  //         title: draft.title ?? "",
  //         answer: draft.answer,
  //         question: draft.question,
  //         tags: draft.tags ?? [],
  //       })
  //     : undefined
  // );

  // const summarizedRef = useRef(summarized);
  // summarizedRef.current = summarized;

  // const handlePublish = async (content: QNASummary) => {
  //   try {
  //     await stageUpdate(createQNA({ ...content, draftId: draft.id }), {
  //       error: "Failed to publish summary",
  //       success: "Summary published!",
  //       pending: "Publishing summary...",
  //     });
  //   } catch (err: any) {
  //     // we don't really need to do anything since the toast proxies the fetch, so
  //     // this catch block is really just to not set summarized.
  //     console.error(err);
  //   }
  // };

  const handleGenerate = async () => {
    setSummarized("");
    setIsGenerating(true);

    // const excluded = Array.from(messageVisibility.keys()).filter((x) =>
    //   messageVisibility.get(x)
    // );

    // try {
    //   const res = await generateSummary(draft.id, {
    //     excluded: Array.from(messageVisibility.keys()).filter(
    //       (x) => !messageVisibility.get(x)
    //     ),
    //     prompt: prompt,
    //   });

    //   setSummarized(res.body);
    //   setIsGenerating(false);
    // } catch (err: any) {
    //   console.error(err);
    // }

    //   const eventSource = new SSE(`/api/qna/moderation/generate`, {
    //     payload: JSON.stringify({
    //       draftId: draft.id,
    //       excluded: Array.from(messageVisibility.keys()).filter(
    //         (x) => !messageVisibility.get(x)
    //       ),
    //       prompt: prompt,
    //     }),
    //   });

    //   eventSource.onmessage = (message) => {
    //     if (message.data === "[DONE]") {
    //       if (summarizedRef.current) handleSummaryChange(summarizedRef.current);
    //       return setIsGenerating(false);
    //     }
    //     console.log("on msg", message.data);

    //     try {
    //       const completionResponse = JSON.parse(message.data);
    //       const text = completionResponse.choices[0].delta?.content || "";
    //       setSummarized((sum) => (sum ?? "") + text);
    //     } catch (err: any) {
    //       console.warn("SSE error", err);
    //     }
    //   };

    //   eventSource.onerror = (err) => {
    //     console.log("on err", err);
    //     setSummarized(`Failed to generate: ${err.type}`);
    //     setIsGenerating(false);
    //     console.error("Failed with generation", err);
    //   };

    //   eventSource.stream();
  };

  // const toggleVisibility = (id: string, visible: boolean) => {
  //   setMessageVisibility(new Map(messageVisibility.set(id, visible)));
  //   console.log(
  //     `Toggled ${id} to ${visible ? "visible" : "invisible"}`,
  //     messageVisibility
  //   );
  // };

  // const handleSummaryChange = async (content: string) => {
  //   if (summarized === content) {
  //     return;
  //   }
  //   console.log("handlesumchange", content);
  //   try {
  //     setSummarized(content);

  //     // try to parse
  //     const parsed = parseQNASummary(content);

  //     if (!parsed) {
  //       setParseFailed(true);
  //       return;
  //     }

  //     setParseFailed(false);

  //     await stageUpdate(upsertDraft(thread.id, parsed), {
  //       error: "Failed to update summary",
  //       success: "Summary updated!",
  //       pending: "Updating summary...",
  //     });

  //     setParsed(parsed);
  //   } catch (err: any) {
  //     // we don't really need to do anything since the toast proxies the fetch, so
  //     // this catch block is really just to not set summarized.
  //     console.error(err);
  //   }
  // };

  // const onMessageEdit = async (id: string, content: string) => {
  //   let message;
  //   let update: () => void;

  //   if (id === thread.messages[0].id) {
  //     message = thread.messages[0];
  //     update = () =>
  //       setStarterMessage({
  //         ...starterMessage,
  //         displayed_content: content,
  //       });
  //   } else {
  //     const messageIndex = threadMessages.findIndex((m) => m.id === id);

  //     if (messageIndex === -1) {
  //       return;
  //     }

  //     message = threadMessages[messageIndex];

  //     if (message.displayed_content === content) {
  //       return;
  //     }

  //     update = () => {
  //       const messageIndex = threadMessages.findIndex((m) => m.id === id);
  //       const message = threadMessages[messageIndex];
  //       setThreadMessages([
  //         ...threadMessages.slice(0, messageIndex),
  //         {
  //           ...message,
  //           displayed_content: content,
  //         },
  //         ...threadMessages.slice(messageIndex + 1),
  //       ]);
  //     };
  //   }

  //   try {
  //     await stageUpdate(editMessage(id, { content }), {
  //       error: "Failed to edit message content",
  //       pending: "Updating message content...",
  //       success: "Message content edited!",
  //     });

  //     update();
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  // };

  // const onMessageDelete = async (id: string): Promise<void> => {
  //   const index = threadMessages.findIndex((m) => m.id === id);

  //   if (index === -1) {
  //     return;
  //   }

  //   try {
  //     await stageUpdate(deleteMessage(id), {
  //       error: "Failed to delete message",
  //       pending: "Deleting message...",
  //       success: "Message deleted!",
  //     });
  //     setThreadMessages([
  //       ...threadMessages.slice(0, index),
  //       ...threadMessages.slice(index + 1),
  //     ]);
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  // };

  // const onPromptChange = async (value: string) => {
  //   if (prompt === value) {
  //     return;
  //   }

  //   try {
  //     await stageUpdate(upsertDraft(thread.id, { prompt: value }), {
  //       error: "Failed to change prompt",
  //       pending: "Updating prompt...",
  //       success: "Prompt updated!",
  //     });
  //     setPrompt(value);
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  // };

  // const onContentChange = async (value: string | QNASummary) => {
  //   console.log("Handling change", value);
  //   if (typeof value === "string") {
  //     setSummarized(value);
  //     setParseFailed(true);
  //     return;
  //   }

  //   await stageUpdate(
  //     throwingFetch(`/api/qna/moderation/${thread.id}/summary`, {
  //       method: "POST",
  //       body: JSON.stringify(value),
  //     }),
  //     {
  //       error: "Failed to update summary",
  //       success: "Summary updated!",
  //       pending: "Updating summary...",
  //     }
  //   );

  //   setParsed(value);
  //   setParseFailed(false);
  // };

  return (
    <div className="flex flex-col pt-12 pb-3">
      {/* <ToastContainer /> */}
      <section className="grid grid-cols-main gap-4">
        <Thread title={thread.title} messages={thread.messages} />
        <ControlPanel
          draft={draft}
          // title={parsed?.title ?? draft.title}
          // question={parsed?.question ?? draft.question ?? undefined}
          // answer={parsed?.answer ?? draft.answer ?? undefined}
          // tags={parsed?.tags ?? draft.tags ?? undefined}
          // summary={summarized}
          // prompt={prompt}
          // disabled={isGenerating}
          // onRegenerate={handleGenerate}
        />
      </section>
    </div>
  );
}

// const stageUpdate = async <T,>(
//   func: Promise<T>,
//   params?: ToastPromiseParams<T, string, string>
// ): Promise<T> => {
//   return await toast.promise(func, {
//     success: "Operation successful",
//     error: "Operation failed",
//     pending: "Executing request...",
//     ...params,
//   });
// };
