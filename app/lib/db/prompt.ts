"use server";

import { auth, client } from "@/app/lib/edgedb";
import e, { createClient } from "@/dbschema/edgeql-js";

export interface Prompt {
  id: string;
  content: string;
}

const getPromptQuery = e.select(e.Prompt, () => ({
  id: true,
  content: true,
}));

export const getPrompt = async () => {
  const prompts = await getPromptQuery.run(client);
  return prompts.length ? prompts[0] : null;
};

const updatePromptQuery = e.params(
  {
    id: e.uuid,
    content: e.str,
  },
  ({ id, content }) => {
    return e.update(e.Prompt, () => ({
      filter_single: { id },
      set: {
        content: content,
      },
    }));
  }
);

export const dbUpdatePrompt = async (id: string, content: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updatePromptQuery.run(client, {
    id,
    content,
  });
};

const addPromptQuery = e.params(
  {
    content: e.str,
  },
  (params) => e.insert(e.Prompt, { content: params.content })
);

export const dbAddPrompt = async (content: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return addPromptQuery.run(client, {
    content,
  });
};
