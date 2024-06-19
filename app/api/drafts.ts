"use server";

import createClient from "edgedb";
import { client } from "../edgedb";
import e from "../../dbschema/edgeql-js";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

interface DraftBody {
  prompt?: string | undefined;
  title?: string | undefined;
  question?: string | undefined;
  answer?: string | undefined;
  tags?: string[] | undefined;
}

interface PublishBody {
  id: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
}

const getDraftsQuery = e.select(e.default.QNADraft, () => ({
  id: true,
  title: true,
  question: true,
  answer: true,
  tags: true,
  limit: 10,
}));

export async function getFtsDrafts(str: string) {
  console.log("fts query");
  return client.query(
    `\
      with res := (
      select fts::search(QNADraft, <str>$str, language := 'eng')
    )
    select res.object {
      id, 
      title, 
      question,
      answer,
      tags,
      score := res.score
    } 
    order by res.score desc;`,
    { str }
  );
}

// export async function getDrafts(query: string) {
//   if (query) return getFtsDrafts(query);
//   return getDraftsQuery.run(client);
// }

export const getDrafts = (query?: string) => {
  console.log("DIDI new q", query);
  if (query) return getFtsDrafts(query);
  return getDraftsQuery.run(client);
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
          displayed_content: true,
          author: {
            name: true,
          },
          created_at: true,
          order_by: {
            expression: message.created_at,
            direction: "ASC",
          },
          revisions: {
            author: { account: { name: true } },
            content: true,
            revised_at: true,
          },
        }),
      },
      filter_single: { id },
    }))
);

export const getDraft = unstable_cache(
  async (id: string) => {
    return getDraftQuery.run(client, { id });
  },
  ["drafts"],
  { tags: ["drafts"] }
);

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
          // linkedTags: e.select(e.Tag, (tag) => ({
          //   filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
          // })),
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
              // linkedTags: e.for(e.json_array_unpack(e.to_json(d.tags)), (tag) =>
              //   e.insert(e.Tag, { name: e.cast(e.str, tag) })
              // ),

              // e.op(
              //   e.select(e.Tag, (tag) => ({
              //     filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
              //   })),
              //   "??",
              //   d.linkedTags
              // ),
            },
          })),
        })),
      () => ({
        question: true,
        answer: true,
        title: true,
        prompt: true,
        tags: true,
        id: true,
      })
    );
  }
);

export const upsertDraft = async (
  id: string,
  body: DraftBody,
  authToken: string
) => {
  const client = createClient().withGlobals({
    "ext::auth::client_token": authToken,
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

export const deleteDraft = async (id: string, authToken: string) => {
  const client = createClient().withGlobals({
    "ext::auth::client_token": authToken,
  });

  deleteDraftQuery.run(client, {
    id,
  });

  revalidateTag("drafts");
  revalidatePath("/drafts");
};

const publishQNAQuery = e.params(
  {
    id: e.uuid,
    slug: e.str,
    title: e.str,
    question: e.str,
    answer: e.str,
    tags: e.array(e.str),
  },
  (params) =>
    e.insert(e.QNA, {
      slug: params.slug,
      answer: params.answer,
      question: params.question,
      linkedTags: e.select(e.Tag, (tag) => ({
        filter: e.op(tag.name, "in", e.array_unpack(params.tags)),
      })),
      thread: e.assert_single(e.delete(e.QNADraft).thread),
      title: params.title,
    })
);

export const publishQNA = async (body: PublishBody) => {
  await publishQNAQuery.run(client, {
    ...body,
    slug: body.title.toLowerCase().replace(/\s+/g, "-"),
  });

  // return deleteDraft(body.id, authToken);
};

export async function generateSummary(draftId: string, body: any) {
  // return _apiCall<Response>(`/drafts/${draftId}/generate`, {
  //   method: "POST",
  //   body,
  // });

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
