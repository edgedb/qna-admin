import { useEffect, useState } from "react";

// import EditableMarkdown from "../../editableMarkdown";
// import UndoIcon from "../../icons/undoIcon";
// import { QNASummary } from "../../datatypes/qnaSummary";

// import styles from "./parsedControls.module.scss";
import TextInput from "../TextInput";
import Tag from "../Tag";
import { CopiedIcon, EditIcon, SaveIcon, UndoIcon } from "@/app/assets/icons";
import IconButton from "../IconButton";
import { QNASummary } from "../utils";
import EditableMarkdown from "../EditableMarkdown";
import { cn } from "@/app/utils";

interface ParsedPanelProps {
  parsed: QNASummary;
  onChange: (parsed: QNASummary) => void;
  className?: string;
}

const seqEquals = <T,>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i != a.length; i++) {
    if (!b.includes(a[i])) {
      return false;
    }
  }

  return true;
};

function ParsedControls({ parsed, onChange, className }: ParsedPanelProps) {
  const [tagsInput, setTagsInput] = useState("");
  const [titleInput, setTitleInput] = useState(parsed.title);

  const [questionContent, setQuestionContent] = useState(parsed.question);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [answerContent, setAnswerContent] = useState(parsed.answer);
  const [editingAnswer, setEditingAnswer] = useState(false);
  const [tags, setTags] = useState(parsed.tags);

  useEffect(() => {
    setTitleInput(parsed.title);
    setQuestionContent(parsed.question);
    setAnswerContent(parsed.answer);
    setTags(parsed.tags);
  }, [parsed]);

  const triggerUpdate = () => {
    onChange({
      answer: answerContent,
      question: questionContent,
      tags: tags,
      title: titleInput,
    });
  };

  const addTag = () => {
    if (tagsInput === "") {
      return;
    }

    setTags([...tags, tagsInput]);
    console.log("Changing tags to", [...tags, tagsInput]);
    setTagsInput("");
  };

  const removeTag = (t: string) => {
    const i = tags.indexOf(t);

    if (i === -1) {
      return;
    }

    const newTags = tags.slice(0, i).concat(tags.slice(i + 1));
    setTags(newTags);

    console.log("Changing tags to", newTags);

    onChange({
      ...(parsed || ""),
      tags: newTags,
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

  return (
    <div className={cn("flex flex-col bg-element rounded p-2", className)}>
      <div className="mb-4">
        <h4 className="flex text-sm">TITLE</h4>
        <TextInput
          onSubmit={triggerUpdate}
          className="my-1 mx-0 text-[15px]"
          value={titleInput}
          onChange={setTitleInput}
          // floatElement={
          //   titleInput !== parsed.title ? (
          //     <IconButton
          //       onClick={(e) => {
          //         e.preventDefault();
          //         setTitleInput(parsed.title);
          //       }}
          //       icon={<UndoIcon />}
          //     />
          //   ) : undefined
          // }
        />
      </div>
      <div className="mb-4">
        <h4 className="text-sm inline">TAGS</h4>
        <div className="flex overflow-x-auto overflow-y-hidden flex-wrap -mt-1.5">
          {tags.map((tag) => (
            <Tag
              key={tag}
              name={tag}
              onRemove={() => {
                removeTag(tag);
              }}
            />
          ))}
        </div>
        <TextInput
          onBlur={() => {
            if (!seqEquals(tags, parsed?.tags || [])) {
              console.log("updating tags");
              triggerUpdate();
            }
          }}
          placeholder="Enter a tag and press Enter to add it"
          value={tagsInput}
          onChange={setTagsInput}
          onSubmit={addTag}
          className="my-1 mx-0 text-[15px]"
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <h4 className="mr-auto text-sm">QUESTION</h4>
          {questionContent !== parsed?.question && (
            <IconButton
              icon={<UndoIcon />}
              onClick={() => {
                setQuestionContent(parsed?.question!);
              }}
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
              if (editingAnswer) conditionalUpdate();
              setEditingQuestion(!editingQuestion);
            }}
          />
        </div>
        <EditableMarkdown
          className={
            editingQuestion ? "bg-white rounded outline-none" : "pl-2.5 px-2.5"
          }
          content={questionContent}
          editing={editingQuestion}
          onContentChange={setQuestionContent}
        />
      </div>
      <div>
        <div className="flex items-center">
          <h4 className="mr-auto text-sm">ANSWER</h4>
          {answerContent !== parsed?.answer && (
            <IconButton
              icon={<UndoIcon />}
              onClick={() => {
                setAnswerContent(parsed?.answer!);
              }}
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
            "",
            editingAnswer
              ? "bg-[#ebebeb] rounded outline-none text-black"
              : "pl-2.5 px-2.5"
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
