"use client";

import { updateQNA } from "../lib/db/qnas";
import ParsedControls from "./ControlPanel/ParsedControls";

export default function QNAPanel({ qna, tags }: { qna: any; tags: any }) {
  const tagsOptions = tags.map(({ name }) => name);

  return (
    <div>
      <ParsedControls
        parsed={qna}
        onChange={(content) => updateQNA(qna.id, content)}
        tagsOptions={tagsOptions}
      />
    </div>
  );
}
