"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CopiedIcon, DeleteIcon, EditIcon } from "../icons";
import IconButton from "../IconButton";
import { updateTag, deleteTag } from "@/app/lib/db/tags";
import { dbUpdate } from "@/app/lib/utils";
import Input from "../Input";

interface TagProps {
  id: string;
  name: string;
}

export default function Tag({ id, name }: TagProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState(name);

  async function onUpdate() {
    setIsEditing(false);

    if (editedTag && editedTag !== name) {
      try {
        await dbUpdate(
          (async () => {
            await updateTag(id, editedTag);
            router.refresh();
          })(),
          {
            pending: "Tag is updating...",
            success: "Tag is updated!",
            error: "Failed to update tag.",
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function onDelete() {
    try {
      await dbUpdate(
        (async () => {
          await deleteTag(id);
          router.refresh();
        })(),
        {
          pending: "Deleting tag...",
          success: "Tag deleted!",
          error: "Failed to delete tag.",
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-element py-2 pl-2.5 pr-1.5 rounded text-text w-[360px] flex justify-between">
      {isEditing ? (
        <Input
          className="w-[278px]"
          value={editedTag}
          onChange={setEditedTag}
        />
      ) : (
        <span>{name}</span>
      )}
      <div className="flex gap-0.5">
        {isEditing ? (
          <IconButton
            onClick={onUpdate}
            icon={<CopiedIcon className="mt-[3px]" />}
            className="text-accentGreen hover:text-hoverGreen"
          />
        ) : (
          <IconButton
            onClick={() => setIsEditing(true)}
            icon={<EditIcon />}
            className="text-accentOrange hover:text-hoverOrange"
          />
        )}
        <IconButton
          onClick={onDelete}
          icon={<DeleteIcon />}
          className="text-accentRed hover:text-hoverRed"
        />
      </div>
    </div>
  );
}
