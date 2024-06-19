CREATE MIGRATION m1gozli3nkyhtv6jz4n3cz3jkbxbpt5r5i2bzyn5qhcjtnswjmivza
    ONTO m1k4ztfd5ithpkzvdgw33sef7nwbgosuerwdcu3twlxlyz7eglte6q
{
  ALTER TYPE default::Message {
      ALTER PROPERTY displayed_content {
          USING (SELECT
              (.content IF NOT (EXISTS (.revisions)) ELSE ((SELECT
                  .revisions ORDER BY
                      .revised_at DESC
              LIMIT
                  1
              )).content)
          );
      };
  };
  ALTER TYPE default::Thread {
      CREATE LINK draft := (.<thread[IS default::QNADraft]);
      ALTER LINK messages {
          ON TARGET DELETE ALLOW;
      };
      CREATE LINK qna := (.<thread[IS default::QNA]);
  };
  DROP TYPE embeddings::Section;
  DROP SCALAR TYPE embeddings::OpenAIEmbedding;
  DROP MODULE embeddings;
  DROP EXTENSION pgvector;
};
