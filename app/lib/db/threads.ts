"use server";

import { createClient } from "edgedb";
import e from "./../../../dbschema/edgeql-js";
import { auth, client } from "@/app/lib/edgedb";

const getThreadsQuery = e.select(e.Thread, (thread) => ({
  id: true,
  title: true,
  messages: {
    author: {
      name: true,
    },
    created_at: true,
    content: true,
    attachments: true,
    limit: 5,
  },
  filter: e.op(
    e.op("not", e.op("exists", thread.draft)),
    "and",
    e.op("not", e.op("exists", thread.qna))
  ),
  limit: 10,
}));

export async function getFtsThreads(str: string) {
  return client.query(
    `\
      with res := (
      select fts::search(Thread, ${str}, language := 'eng')
    )
    select res.object {
      id, 
      title,
      score := res.score, 
      messages: {
        id, 
        author: {
          name
          },
        attachments
        }
      }
    order by res.score desc;`,
    { str }
  );
}

export async function getThreads(query: string) {
  if (query) return getFtsThreads(query);
  return getThreadsQuery.run(client);
}

const getThreadQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) =>
    e.select(e.discord.Thread, () => ({
      id: true,
      title: true,
      messages: {
        id: true,
        author: {
          name: true,
        },
        attachments: true,
        created_at: true,
        content: true,
      },
      filter_single: { id },
    }))
);

export async function getThread(id: string) {
  return getThreadQuery.run(client, { id });
}

const deleteThreadQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) => {
    return e.delete(e.Thread, () => ({
      filter_single: { id },
    }));
  }
);

export const deleteThread = async (id: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  deleteThreadQuery.run(client, {
    id,
  });
};

// Messages
const updateMessageQuery = e.params(
  {
    id: e.uuid,
    content: e.str,
  },
  ({ id, content }) => {
    return e.update(e.Message, () => ({
      filter_single: { id },
      set: {
        content: content,
      },
    }));
  }
);

export const updateMessage = async (id: string, content: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updateMessageQuery.run(client, {
    id,
    content,
  });
};

const deleteMessageQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) => {
    return e.delete(e.Message, () => ({
      filter_single: { id },
    }));
  }
);

export const deleteMessage = async (id: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return deleteMessageQuery.run(client, {
    id,
  });
};
