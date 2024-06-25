"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { addTag } from "@/app/lib/db/tags";
import TextInput from "../TextInput";
import Tag from "./Tag";
import { dbUpdate } from "@/app/lib/utils";

interface TagsPanelProps {
  tags: { id: string; name: string }[];
}

export default function TagsPanel({ tags }: TagsPanelProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");

  async function onAdd() {
    const tag = tagInput.trim();
    if (tag === "") return;

    try {
      await dbUpdate(
        (async () => {
          await addTag(tag);
          router.refresh();
          setTagInput("");
        })(),
        {
          pending: "Adding tag...",
          success: "Tag added!",
          error: "Failed to add tag.",
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-10 flex justify-center">
      <div className="">
        <TextInput
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={setTagInput}
          onSubmit={onAdd}
          className="mb-6 w-[360px] m-auto"
        />
        <div className="grid grid-cols-[360px_360px_360px] gap-y-4 gap-x-6">
          {tags.map((tag) => (
            <Tag key={tag.id} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
