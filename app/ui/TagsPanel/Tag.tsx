"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopiedIcon, EditIcon } from "../icons";
import IconButton from "../IconButton";
import { TagT, dbUpdateTag } from "@/app/lib/db/tags";
import { dbUpdate } from "@/app/lib/utils";
import Input from "../Input";
import SwitchButton from "./SwitchButton";

export default function Tag({ id, name, disabled }: TagT) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState(name);
  const [isDisabled, setIsDisabled] = useState(disabled);

  async function updateTagName() {
    setIsEditing(false);

    if (editedTag && editedTag !== name) {
      try {
        await dbUpdate(
          (async () => {
            await dbUpdateTag(id, { name: editedTag });
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

  async function toggleTag() {
    try {
      await dbUpdate(
        (async () => {
          await dbUpdateTag(id, { disabled: !isDisabled });
          setIsDisabled(!isDisabled);
        })(),
        {
          pending: "Tag is updating...",
          success: "Tag is updated!",
          error: "Failed to update tag.",
        }
      );
      router.refresh();
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
      <div className="flex gap-0.5 items-center">
        {isEditing ? (
          <IconButton
            onClick={updateTagName}
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
        <SwitchButton disabled={isDisabled || false} onChange={toggleTag} />
      </div>
    </div>
  );
}
