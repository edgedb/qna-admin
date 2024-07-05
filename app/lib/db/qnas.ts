"use server";

import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { auth } from "@/app/lib/edgedb";
import { getFtsQnasCount } from "./queries/getFtsQnasCount.query";
import { getFtsQnas } from "./queries/getFtsQnas.query";

const client = createClient();

interface UpdateQnaBody {
  title?: string;
  question?: string;
  answer?: string;
  tags?: string[];
}

const getQnasQuery = e.params(
  {
    offset: e.int32,
    limit: e.int16,
    tag: e.optional(e.str),
  },
  ({ offset, limit, tag }) =>
    e.select(e.QNA, (q) => ({
      id: true,
      title: true,
      question: true,
      linkedTags: {
        name: true,
        disabled: true,
      },
      filter: e.op(e.op(tag, "in", q.tags), "??", true),
      offset: offset,
      limit: limit,
    }))
);

const ITEMS_PER_PAGE = 10;

interface QNAs {
  currentPage?: number;
  query?: string;
  tag?: string;
}

export const getQnas = ({ currentPage = 1, query, tag }: QNAs) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (query) {
    return getFtsQnas(client, { query, offset, limit: ITEMS_PER_PAGE });
  }

  return getQnasQuery.run(client, { offset, limit: ITEMS_PER_PAGE, tag });
};

export const getQnasPages = async (query?: string) => {
  let count = 0;

  if (query) {
    count = await getFtsQnasCount(client, { query });
  } else {
    count = await e.count(e.QNA).run(client);
  }

  return Math.ceil(count / ITEMS_PER_PAGE);
};

const getQnaQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) =>
    e.select(e.QNA, () => ({
      id: true,
      title: true,
      question: true,
      answer: true,
      tags: true,
      filter_single: { id },
    }))
);

export type QnaT = Awaited<ReturnType<typeof getQna>>;

export const getQna = async (id: string) => {
  return getQnaQuery.run(client, { id });
};

const updateQNAQuery = e.params(
  {
    id: e.uuid,
    title: e.optional(e.str),
    question: e.optional(e.str),
    answer: e.optional(e.str),
    tags: e.optional(e.array(e.str)),
  },
  (params) =>
    e.update(e.QNA, (q) => ({
      filter_single: { id: params.id },
      set: {
        title: e.op(params.title, "??", q.title),
        question: e.op(params.question, "??", q.question),
        answer: e.op(params.answer, "??", q.answer),
        linkedTags: e.select(e.Tag, (tag) => ({
          filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
        })),
      },
    }))
);

export const dbUpdateQna = async (id: string, body: UpdateQnaBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updateQNAQuery.run(client, {
    id,
    ...body,
  });
};
