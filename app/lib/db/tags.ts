"use server";

import { auth, client } from "@/app/lib/edgedb";
import e, { createClient } from "@/dbschema/edgeql-js";

export interface TagT {
  id: string;
  name: string;
  disabled: boolean | null;
}

const getTagsQuery = e.select(e.Tag, () => ({
  id: true,
  name: true,
  disabled: true,
}));

export const getAllTags = () => {
  return getTagsQuery.run(client);
};

const getActiveTagsQuery = e.select(e.Tag, (t) => ({
  name: true,
  filter: e.op(t.disabled, "?!=", true),
}));

export const getActiveTags = () => {
  return getActiveTagsQuery.run(client);
};

const updateTagQuery = e.params(
  {
    id: e.uuid,
    name: e.optional(e.str),
    disabled: e.optional(e.bool),
  },
  ({ id, name, disabled }) => {
    return e.update(e.Tag, (t) => ({
      filter_single: { id },
      set: {
        name: e.op(name, "??", t.name),
        disabled: e.op(e.op(disabled, "??", t.disabled), "??", false),
      },
    }));
  }
);

interface UpdateTagBody {
  name?: string;
  disabled?: boolean;
}

export const dbUpdateTag = async (id: string, body: UpdateTagBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updateTagQuery.run(client, { id, ...body });
};

const addTagQuery = e.params(
  {
    name: e.str,
    disabled: e.optional(e.bool),
  },
  (params) =>
    e.insert(e.Tag, {
      name: params.name,
      disabled: e.op(params.disabled, "??", false),
    })
);

interface AddTagBody {
  name: string;
  disabled?: boolean;
}

export const dbAddTag = async (body: AddTagBody) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return addTagQuery.run(client, body);
};
