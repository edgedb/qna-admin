import { useEffect, useState } from "react";

import TextInput from "../TextInput";
import { CopiedIcon, EditIcon, SaveIcon, UndoIcon } from "@/app/ui/icons";
import IconButton from "../IconButton";
import { QNASummary } from "../utils";
import EditableMarkdown from "../EditableMarkdown";
import { cn } from "@/app/utils";
import MultiSelect from "./MultiSelect";

interface ParsedPanelProps {
  parsed: QNASummary;
  tagsOptions: string[];
  onChange: (parsed: Partial<QNASummary>) => void;
  className?: string;
  isDraft?: boolean;
}

function ParsedControls({
  parsed,
  onChange,
  className,
  tagsOptions,
  isDraft = false,
}: ParsedPanelProps) {
  const [titleInput, setTitleInput] = useState(parsed.title);

  const [questionContent, setQuestionContent] = useState(parsed.question);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [answerContent, setAnswerContent] = useState(parsed.answer);
  const [editingAnswer, setEditingAnswer] = useState(false);
  const [tags, setTags] = useState(parsed.tags);

  // useEffect(() => {
  //   if (isDraft) {
  //     setTitleInput(parsed.title);
  //     setQuestionContent(parsed.question);
  //     setAnswerContent(parsed.answer);
  //     setTags(parsed.tags);

  //     onChange({
  //       answer: parsed.answer,
  //       question: parsed.question,
  //       ...(parsed.tags && { tags: parsed.tags }),
  //       title: parsed.title,
  //     });
  //   }
  // }, [parsed]);

  const triggerUpdate = () => {
    onChange({
      answer: answerContent,
      question: questionContent,
      tags: tags,
      title: titleInput,
    });
  };

  const conditionalUpdate = () => {
    if (
      questionContent !== parsed?.question ||
      answerContent !== parsed?.answer ||
      titleInput !== parsed?.title
    ) {
      triggerUpdate();
    }
  };

  function updateTags(tags: string[]) {
    setTags(tags);
    onChange({ tags });
  }

  return (
    <div className={cn("flex flex-col bg-element rounded p-4 pb-2", className)}>
      <div className="mb-4">
        <h4 className="flex text-sm">TITLE</h4>
        <TextInput
          onSubmit={triggerUpdate}
          className="my-1 mx-0 text-[15px] border border-border focus:border-[#8d8d8d]"
          value={titleInput}
          onChange={setTitleInput}
          floatElement={
            titleInput !== parsed.title ? (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  setTitleInput(parsed.title);
                }}
                icon={<UndoIcon />}
                className="mb-0.5 text-accentOrange hover:text-hoverOrange"
              />
            ) : undefined
          }
        />
      </div>
      <div className="mb-4">
        <h4 className="text-sm mb-2">TAGS</h4>
        <MultiSelect
          options={tagsOptions}
          selected={tags}
          updateSelected={updateTags}
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <h4 className="mr-auto text-sm">QUESTION</h4>
          {questionContent !== parsed?.question && editingQuestion && (
            <IconButton
              icon={<UndoIcon />}
              onClick={() => {
                setQuestionContent(parsed?.question!);
              }}
              className="text-accentOrange hover:text-hoverOrange relative bottom-0.5"
            />
          )}
          <IconButton
            icon={editingQuestion ? <CopiedIcon /> : <EditIcon />}
            className={
              editingQuestion
                ? "text-accentGreen hover:text-hoverGreen"
                : "text-accentOrange hover:text-hoverOrange"
            }
            onClick={() => {
              if (editingQuestion) conditionalUpdate();
              setEditingQuestion(!editingQuestion);
            }}
          />
        </div>
        <EditableMarkdown
          className={editingQuestion ? "bg-white rounded outline-none" : ""}
          content={questionContent}
          editing={editingQuestion}
          onContentChange={setQuestionContent}
        />
      </div>
      <div>
        <div className="flex items-center">
          <h4 className="mr-auto text-sm">ANSWER</h4>
          {answerContent !== parsed?.answer && editingAnswer && (
            <IconButton
              icon={<UndoIcon />}
              onClick={() => {
                setAnswerContent(parsed?.answer!);
              }}
              className="text-accentOrange hover:text-hoverOrange relative bottom-0.5"
            />
          )}
          <IconButton
            icon={editingAnswer ? <CopiedIcon /> : <EditIcon />}
            className={
              editingAnswer
                ? "text-accentGreen hover:text-hoverGreen"
                : "text-accentOrange hover:text-hoverOrange"
            }
            onClick={() => {
              if (editingAnswer) conditionalUpdate();
              setEditingAnswer(!editingAnswer);
            }}
          />
        </div>
        <EditableMarkdown
          className={cn(
            editingAnswer ? "bg-[#ebebeb] rounded outline-none text-black" : ""
          )}
          content={answerContent}
          editing={editingAnswer}
          onContentChange={setAnswerContent}
        />
      </div>
    </div>
  );
}

export default ParsedControls;
