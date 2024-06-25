"use server";

import createClient from "edgedb";
import { client, auth } from "@/app/lib/edgedb";
import e from "@/dbschema/edgeql-js";

interface DraftBody {
  prompt?: string | undefined;
  title?: string | undefined;
  question?: string | undefined;
  answer?: string | undefined;
  tags?: string[] | undefined;
}

interface PublishBody {
  draftId: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
}

const getDraftsQuery = e.params(
  {
    offset: e.int32,
    limit: e.int16,
  },
  ({ offset, limit }) =>
    e.select(e.default.QNADraft, () => ({
      id: true,
      title: true,
      question: true,
      answer: true,
      tags: true,
      offset: offset,
      limit: limit,
    }))
);

export async function getFtsDrafts(
  query: string,
  offset: number,
  limit: number
) {
  return client.query(
    `\
      with res := (
      select fts::search(QNADraft, <str>$query, language := 'eng')
    )
    select res.object {
      id, 
      title, 
      question,
      answer,
      tags,
      score := res.score
    } 
    order by res.score desc
    offset <int32>$offset
    limit <int16>$limit;`,
    { query, offset, limit }
  );
}

const ITEMS_PER_PAGE = 10;

export const getDrafts = (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (query) return getFtsDrafts(query, offset, ITEMS_PER_PAGE);
  return getDraftsQuery.run(client, { offset, limit: ITEMS_PER_PAGE });
};

export const getDraftsPages = async (query: string) => {
  let count = 0;

  if (query) {
    count = await client.query(
      `\
        with res := (
        select fts::search(QNADraft, <str>$query, language := 'eng')
      )
      select count(res.object)`,
      { query }
    );
  } else {
    count = await e.select(e.count(e.QNADraft)).run(client);
  }

  return Math.ceil(count / ITEMS_PER_PAGE);
};

const getDraftQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) =>
    e.select(e.QNADraft, () => ({
      id: true,
      answer: true,
      question: true,
      title: true,
      tags: true,
      prompt: true,
      thread: {
        id: true,
        title: true,
        messages: (message) => ({
          id: true,
          content: true,
          author: {
            name: true,
          },
          attachments: true,
          created_at: true,
          order_by: {
            expression: message.created_at,
            direction: "ASC",
          },
        }),
      },
      filter_single: { id },
    }))
);

export const getDraft = async (id: string) => {
  return getDraftQuery.run(client, { id });
};

const upsertDraftQuery = e.params(
  {
    prompt: e.optional(e.str),
    title: e.optional(e.str),
    question: e.optional(e.str),
    answer: e.optional(e.str),
    tags: e.optional(e.array(e.str)),
    threadId: e.uuid,
  },
  (params) => {
    const thread = e.select(e.Thread, (thread) => ({
      first_msg: true,
      filter_single: e.op(thread.id, "=", params.threadId),
    }));

    return e.select(
      e
        .insert(e.QNADraft, {
          thread: thread,
          title: params.title,
          question: e.op(params.question, "??", thread.first_msg),
          answer: params.answer,
          linkedTags: e.select(e.Tag, (tag) => ({
            filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
          })),
          prompt: params.prompt,
        })
        .unlessConflict((draft) => ({
          on: draft.thread,
          else: e.update(draft, (d) => ({
            set: {
              title: e.op(params.title, "??", d.title),
              question: e.op(params.question, "??", d.question),
              answer: e.op(params.answer, "??", d.answer),
              prompt: e.op(params.prompt, "??", d.prompt),
              linkedTags: e.select(e.Tag, (tag) => ({
                filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
              })),
            },
          })),
        })),
      () => ({
        question: true,
        answer: true,
        prompt: true,
        tags: true,
        id: true,
      })
    );
  }
);

export const upsertDraft = async (id: string, body: DraftBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return upsertDraftQuery.run(client, {
    threadId: id,
    ...body,
  });
};

const deleteDraftQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) => {
    return e.delete(e.QNADraft, () => ({
      filter_single: { id },
    }));
  }
);

export const deleteDraft = async (id: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return deleteDraftQuery.run(client, {
    id,
  });
};

const createQNAQuery = e.params(
  {
    draftId: e.uuid,
    title: e.str,
    question: e.str,
    answer: e.str,
    tags: e.array(e.str),
  },
  (params) =>
    e.select(
      e.insert(e.QNA, {
        title: params.title,
        answer: params.answer,
        question: params.question,
        linkedTags: e.select(e.Tag, (tag) => ({
          filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
        })),
        thread: e.assert_single(
          e.delete(e.QNADraft, () => ({
            filter_single: { id: params.draftId },
          }))
        ).thread,
      }),
      () => ({
        id: true,
        title: true,
        question: true,
        answer: true,
        tags: true,
      })
    )
);

export const createQNA = async (body: PublishBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return createQNAQuery.run(client, body);
};

export async function generateSummary(draftId: string, body: any) {
  const res = await fetch(
    new URL(`/drafts/${draftId}/generate`, process.env.QNA_API_URL),
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${process.env.QNA_API_SECRET}`,
        Accept: "application/json, text/plain, */*",
        "Content-Type": "text/event-stream",
      },
    }
  );

  if (res.ok) {
    return res.json();
  }

  throw new Error(
    `api call failed with status ${res.status}: ${await res.text()}`
  );
}
