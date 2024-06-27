"use client";

import { type QnaT, dbUpdateQna } from "../lib/db/qnas";
import { QNASummary, dbUpdate } from "../lib/utils";
import ParsedControls from "./ControlPanel/ParsedControls";

interface QNAPanelProps {
  qna: NonNullable<QnaT>;
  tags: {
    name: string;
  }[];
}

export default function QNAPanel({ qna, tags }: QNAPanelProps) {
  const tagsOptions = tags.map(({ name }) => name);

  const updateQNA = async (content: Partial<QNASummary>) => {
    try {
      await dbUpdate(dbUpdateQna(qna.id, content), {
        pending: "Updating qna...",
        success: "QNA updated!",
        error: "Failed to update QNA.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ParsedControls
      parsed={qna}
      onChange={updateQNA}
      tagsOptions={tagsOptions}
    />
  );
}
