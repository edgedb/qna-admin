"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code } from "../Code";
import { cn } from "../utils";
import IconButton from "../IconButton";
import { CopiedIcon, DeleteIcon, EditIcon, UndoIcon } from "../icons";
import Input from "../Input";
import { type MessageT, dbDeleteMsg, dbUpdateMsg } from "@/app/lib/db/threads";
import { dbUpdate } from "@/app/lib/utils";
import Attachment from "./Attachment";

interface MessageProps {
  msg: Omit<MessageT, "created_at">;
  className?: string;
  editable?: boolean;
}

export default function Message({
  msg,
  className,
  editable = false,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(msg.content);
  const [message, setMessage] = useState(msg.content);

  const startEditing = () => {
    setIsEditing(true);
  };

  const undoEdit = () => {
    setEditedContent(message);
  };

  const updateMessage = async () => {
    if (editedContent !== message) {
      try {
        await dbUpdate(dbUpdateMsg(msg.id, editedContent), {
          pending: "Updating message...",
          success: "Message updated!",
          error: "Failed to update message.",
        });

        setMessage(editedContent);
      } catch (err) {
        console.error(err);
      }
    }
    setIsEditing(false);
  };

  const deleteMessage = async () => {
    try {
      await dbUpdate(dbDeleteMsg(msg.id), {
        pending: "Deleting message...",
        success: "Message deleted!",
        error: "Failed to delete message.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      key={msg.id}
      className={cn("bg-element mb-4 py-2.5 px-4 rounded", className)}
    >
      <div className="flex text-accentOrange  text-sm mb-2 justify-between">
        <span className="opacity-60">{msg.author.name}</span>
        {editable && (
          <>
            {isEditing ? (
              <div className="flex gap-0.5 -mt-1 -mr-1.5">
                {editedContent !== message && (
                  <IconButton
                    onClick={undoEdit}
                    icon={<UndoIcon />}
                    className="text-accentOrange hover:text-hoverOrange"
                  ></IconButton>
                )}
                <IconButton
                  onClick={updateMessage}
                  icon={<CopiedIcon className="mt-[3px]" />}
                  className="text-accentGreen hover:text-hoverGreen"
                ></IconButton>
              </div>
            ) : (
              <div className="flex gap-0.5 -mt-1 -mr-1.5">
                <IconButton
                  onClick={deleteMessage}
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
      <div>
        {isEditing ? (
          <Input value={editedContent} onChange={setEditedContent} />
        ) : (
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
            {message}
          </ReactMarkdown>
        )}
      </div>
      {msg.attachments && msg.attachments.length > 0 && (
        <div className="flex flex-col bg-element">
          {msg.attachments.map((attachment) => (
            <Attachment key={attachment} url={attachment} />
          ))}
        </div>
      )}
    </div>
  );
}
