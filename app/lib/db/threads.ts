"use server";

import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { auth, client } from "@/app/lib/edgedb";
import { getFtsThreadsCount } from "./queries/getFtsThreadsCount.query";
import { getFtsThreads } from "./queries/getFtsThreads.query";
import { getThreadsCount } from "./queries/getThreadsCount.query";

// message type from getThread
export interface MessageT {
  id: string;
  content: string;
  created_at: Date;
  author: {
    name: string | null;
  };
  attachments: string[] | null;
}

const getThreadsQuery = e.params(
  {
    offset: e.int32,
    limit: e.int16,
  },
  ({ offset, limit }) =>
    e.select(e.discord.Thread, (thread) => ({
      id: true,
      messages: {
        content: true,
        created_at: true,
        limit: 5,
      },
      filter: e.op(
        e.op("not", e.op("exists", thread.draft)),
        "and",
        e.op("not", e.op("exists", thread.qna))
      ),
      offset: offset,
      limit: limit,
    }))
);

const ITEMS_PER_PAGE = 10;

export interface ThreadEssential {
  id: string;
  messages: {
    content: string;
    created_at: Date;
  }[];
}

export const getThreads = (currentPage: number, query?: string) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (query)
    return getFtsThreads(client, { query, offset, limit: ITEMS_PER_PAGE });
  return getThreadsQuery.run(client, { offset, limit: ITEMS_PER_PAGE });
};

export const getThreadsPages = async (query?: string) => {
  let count = 0;

  if (query) {
    count = await getFtsThreadsCount(client, { query });
  } else {
    count = await getThreadsCount(client);
  }

  return Math.ceil(count / ITEMS_PER_PAGE);
};

const getThreadQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) =>
    e.select(e.discord.Thread, () => ({
      id: true,
      messages: {
        id: true,
        content: true,
        created_at: true,
        author: {
          name: true,
        },
        attachments: true,
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
    return e.delete(e.discord.Thread, () => ({
      filter_single: { id },
    }));
  }
);

export const dbDeleteThread = async (id: string) => {
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
    return e.update(e.discord.Message, () => ({
      filter_single: { id },
      set: {
        content: content,
      },
    }));
  }
);

export const dbUpdateMsg = async (id: string, content: string) => {
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
    return e.delete(e.discord.Message, () => ({
      filter_single: { id },
    }));
  }
);

export const dbDeleteMsg = async (id: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return deleteMessageQuery.run(client, {
    id,
  });
};
