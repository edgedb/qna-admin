"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagT, dbAddTag } from "@/app/lib/db/tags";
import { dbUpdate } from "@/app/lib/utils";
import TextInput from "../TextInput";
import Tag from "./Tag";

export default function TagsPanel({ tags }: { tags: TagT[] }) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");

  async function addTag() {
    const tag = tagInput.trim();
    if (tag === "") return;

    try {
      await dbUpdate(
        (async () => {
          await dbAddTag({ name: tag });
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
          onSubmit={addTag}
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
