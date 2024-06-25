"use server";

import { createClient } from "edgedb";
import e from "../../../dbschema/edgeql-js";
import { auth } from "@/app/lib/edgedb";
import { Identity } from "@/dbschema/edgeql-js/modules/ext/auth";

const client = createClient();

interface UpdateQNABody {
  title?: string;
  question?: string;
  answer?: string;
  tags?: string[];
}

const getQNAsQuery = e.params(
  {
    offset: e.int32,
    limit: e.int16,
  },
  ({ offset, limit }) =>
    e.select(e.default.QNA, () => ({
      id: true,
      title: true,
      question: true,
      answer: true,
      tags: true,
      offset: offset,
      limit: limit,
    }))
);

export async function getFtsQNAs(query: string, offset: number, limit: number) {
  return client.query(
    `\
      with res := (
      select fts::search(QNA, <str>$query, language := 'eng')
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

export const getQNAs = (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (query) return getFtsQNAs(query, offset, ITEMS_PER_PAGE);
  return getQNAsQuery.run(client, { offset, limit: ITEMS_PER_PAGE });
};

export const getQNAsPages = async (query: string) => {
  let count = 0;

  if (query) {
    count = await client.query(
      `\
        with res := (
        select fts::search(QNA, <str>$query, language := 'eng')
      )
      select count(res.object)`,
      { query }
    );
  } else {
    count = await e.select(e.count(e.QNADraft)).run(client);
  }

  return Math.ceil(count / ITEMS_PER_PAGE);
};

const getQNAQuery = e.params(
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

export const getQNA = async (id: string) => {
  return getQNAQuery.run(client, { id });
};

const updateQNAQuery = e.params(
  {
    id: e.uuid,
    title: e.optional(e.str),
    question: e.optional(e.str),
    answer: e.optional(e.str),
    tags: e.optional(e.array(e.str)),
  },
  (params) => {
    return e.select(
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
      })),

      () => ({
        id: true,
        title: true,
        question: true,
        answer: true,
        tags: true,
      })
    );
  }
);

export const updateQNA = async (id: string, body: UpdateQNABody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updateQNAQuery.run(client, {
    id,
    ...body,
  });
};
