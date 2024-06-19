"use server";

import { createClient } from "edgedb";
import e from "../../dbschema/edgeql-js";

const client = createClient();

const getQNAsQuery = e.select(e.default.QNA, () => ({
  id: true,
  slug: true,
  title: true,
  question: true,
  answer: true,
  tags: true,
  thread: {
    id: true,
    title: true,
    messages: {
      id: true,
      author: {
        name: true,
      },
      content: true,
      created_at: true,
      displayed_content: true,
      revisions: {
        author: true,
        content: true,
        revised_at: true,
      },
    },
  },
}));

export async function getQnas() {
  return getQNAsQuery.run(client);
}
