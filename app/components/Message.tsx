"use client";

import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code } from "./Code";
import { cn } from "../utils";
import IconButton from "./IconButton";
import { CloseIcon, CopiedIcon, DeleteIcon, EditIcon } from "../assets/icons";
import Input from "./Input";
import { deleteMessage, updateMessage } from "../api/threads";
import { stageUpdate } from "./utils";

interface MessageProps {
  msg: any;
  className?: string;
  editable?: boolean;
  token: string | null;
}

export default function Message({
  msg,
  className,
  editable = false,
  token,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(msg.displayed_content);
  const [message, setMessage] = useState(msg.displayed_content);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message);
  };

  const saveEdit = async () => {
    try {
      await stageUpdate(updateMessage(msg.id, editedContent, token!), {
        error: "Failed to edit message content",
        pending: "Updating message content...",
        success: "Message content edited!",
      });

      setMessage(editedContent);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    try {
      await stageUpdate(deleteMessage(msg.id, token!), {
        error: "Failed to delete message",
        pending: "Deleting message...",
        success: "Message deleted!",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      key={msg.id}
      className={cn("bg-element mb-4 py-2 px-3 rounded", className)}
    >
      <div className="flex text-accentOrange  text-sm mb-2 justify-between">
        <span className="opacity-60">{msg.author.name}</span>
        {editable && (
          <>
            {isEditing ? (
              <div className="flex gap-0.5 -mt-1 -mr-1.5">
                <IconButton
                  onClick={saveEdit}
                  icon={<CopiedIcon className="mt-[3px]" />}
                  className="text-accentGreen hover:text-hoverGreen"
                ></IconButton>
                <IconButton
                  onClick={cancelEdit}
                  icon={<CloseIcon />}
                  className="text-accentOrange hover:text-hoverOrange"
                ></IconButton>
              </div>
            ) : (
              <div className="flex gap-0.5 -mt-1 -mr-1.5">
                <IconButton
                  onClick={onDelete}
                  icon={<DeleteIcon />}
                  className="text-accentRed hover:text-hoverRed"
                />
                <IconButton
                  onClick={startEditing}
                  icon={<EditIcon />}
                  className="text-accentOrange hover:text-hoverOrange"
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="">
        {isEditing ? (
          <Input
            className=""
            value={editedContent}
            onChange={setEditedContent}
          />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ className, children }) => {
                return (
                  <Code
                    code={children!.toString()}
                    language={className?.replace(/^language-/, "") ?? ""}
                  />
                );
              },
            }}
          >
            {message}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
