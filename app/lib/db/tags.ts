"use server";

import { auth, client } from "@/app/lib/edgedb";
import e, { createClient } from "@/dbschema/edgeql-js";

const getTagsQuery = e.select(e.default.Tag, () => ({
  id: true,
  name: true,
}));

export const getTags = () => {
  return getTagsQuery.run(client);
};

const deleteTagQuery = e.params(
  {
    id: e.uuid,
  },
  ({ id }) => {
    return e.delete(e.Tag, () => ({
      filter_single: { id },
    }));
  }
);

export const deleteTag = async (id: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return deleteTagQuery.run(client, {
    id,
  });
};

const updateTagQuery = e.params(
  {
    id: e.uuid,
    name: e.str,
  },
  ({ id, name }) => {
    return e.update(e.Tag, () => ({
      filter_single: { id },
      set: {
        name: name,
      },
    }));
  }
);

export const updateTag = async (id: string, name: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return updateTagQuery.run(client, {
    id,
    name,
  });
};

const addTagQuery = e.params(
  {
    name: e.str,
  },
  (params) => e.insert(e.Tag, { name: params.name })
);

export const addTag = async (name: string) => {
  const session = auth.getSession();

  const client = createClient().withGlobals({
    "ext::auth::client_token": session.authToken,
  });

  return addTagQuery.run(client, {
    name,
  });
};
