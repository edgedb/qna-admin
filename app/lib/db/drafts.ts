"use server";

import createClient from "edgedb";
import { client, auth } from "@/app/lib/edgedb";
import e from "@/dbschema/edgeql-js";
import { getFtsDraftsCount } from "./queries/getFtsDraftsCount.query";
import { getFtsDrafts } from "./queries/getFtsDrafts.query";

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

export interface DraftEssential {
  id: string;
  title: string | null;
  question: string | null;
  linkedTags: {
    name: string;
    disabled: boolean | null;
  }[];
}

const getDraftsQuery = e.params(
  {
    offset: e.int32,
    limit: e.int16,
  },
  ({ offset, limit }) =>
    e.select(e.QNADraft, () => ({
      id: true,
      title: true,
      question: true,
      linkedTags: {
        name: true,
        disabled: true,
      },
      offset: offset,
      limit: limit,
    }))
);

const ITEMS_PER_PAGE = 10;

export const getDrafts = (currentPage: number, query?: string) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (query) {
    return getFtsDrafts(client, { query, offset, limit: ITEMS_PER_PAGE });
  }
  return getDraftsQuery.run(client, { offset, limit: ITEMS_PER_PAGE });
};

export const getDraftsPages = async (query?: string) => {
  let count = 0;

  if (query) {
    count = await getFtsDraftsCount(client, { query });
  } else {
    count = await e.count(e.QNADraft).run(client);
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
        messages: (message) => ({
          id: true,
          content: true,
          author: {
            name: true,
          },
          attachments: true,
          order_by: {
            expression: message.created_at,
            direction: "ASC",
          },
        }),
      },
      filter_single: { id },
    }))
);

export type DraftT = Awaited<ReturnType<typeof getDraft>>;

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
    const thread = e.select(e.discord.Thread, (thread) => ({
      messages: true,
      filter_single: e.op(thread.id, "=", params.threadId),
    }));

    const first_msg = e.array_agg(
      e.select(thread.messages, () => ({
        content: true,
        limit: 1,
      }))
    )[0];

    return e.select(
      e
        .insert(e.QNADraft, {
          thread: thread,
          title: params.title,
          question: e.op(params.question, "??", first_msg.content),
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
        id: true,
      })
    );
  }
);

export const dbUpsertDraft = async (id: string, body: DraftBody) => {
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

export const dbDeleteDraft = async (id: string) => {
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
      })
    )
);

export const dbCreateQNA = async (body: PublishBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return createQNAQuery.run(client, body);
};
