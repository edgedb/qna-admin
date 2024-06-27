"use client";

import { dbUpdate } from "@/app/lib/utils";
import { createDraftAction, deleteThreadAction } from "./actions";

export default function ThreadControls({ id }: { id: string }) {
  async function createDraft() {
    try {
      await dbUpdate(createDraftAction(id), {
        pending: "Creating QNA draft...",
        success: "QNA draft created!",
        error: "Failed to create QNA draft.",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteThread() {
    try {
      await dbUpdate(deleteThreadAction(id), {
        pending: "Deleting thread...",
        success: "Thread deleted!",
        error: "Failed to delete thread.",
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <button
        onClick={deleteThread}
        className="text-xs py-1 px-2 bg-accentRed rounded text-black hover:text-black hover:bg-hoverRed transition-colors mr-2"
      >
        DELETE THREAD
      </button>
      <button
        onClick={createDraft}
        className="text-xs py-1 px-2 bg-accentGreen rounded text-black hover:text-black hover:bg-hoverGreen transition-colors"
      >
        CREATE A DRAFT
      </button>
    </div>
  );
}
