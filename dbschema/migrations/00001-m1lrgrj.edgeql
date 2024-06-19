CREATE MIGRATION m1lrgrjjbq5hhzjltw2yshtlakr3xzrnu6qymzdu7jafks67dnneba
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.4';
  CREATE MODULE discord IF NOT EXISTS;
  CREATE MODULE embeddings IF NOT EXISTS;
  CREATE ABSTRACT TYPE default::Author {
      CREATE PROPERTY name: std::str;
  };
  CREATE TYPE discord::User {
      CREATE REQUIRED PROPERTY user_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.user_id);
  };
  CREATE TYPE discord::Author EXTENDING default::Author, discord::User;
  CREATE TYPE default::Revision {
      CREATE PROPERTY content: std::str;
      CREATE REQUIRED LINK author: default::Author;
      CREATE PROPERTY revised_at: std::datetime;
  };
  CREATE ABSTRACT TYPE default::Message {
      CREATE REQUIRED LINK author: default::Author;
      CREATE MULTI LINK revisions: default::Revision;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY displayed_content := (SELECT
          (.content IF NOT (EXISTS (.revisions)) ELSE (SELECT
              .revisions.content 
          LIMIT
              1
          ))
      );
  };
  CREATE TYPE discord::Message EXTENDING default::Message {
      CREATE REQUIRED PROPERTY message_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.message_id);
  };
  CREATE ABSTRACT TYPE default::Thread {
      CREATE MULTI LINK messages: default::Message;
      CREATE PROPERTY title: std::str;
  };
  CREATE TYPE discord::ReviewCard {
      CREATE REQUIRED PROPERTY message_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.message_id);
      CREATE REQUIRED PROPERTY thread_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE discord::Thread EXTENDING default::Thread {
      CREATE LINK review_card: discord::ReviewCard;
      CREATE REQUIRED PROPERTY thread_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.thread_id);
      CREATE MULTI LINK suggested_by: discord::User;
  };
  CREATE TYPE default::QNA {
      CREATE REQUIRED LINK thread: default::Thread {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY answer: std::str;
      CREATE REQUIRED PROPERTY question: std::str;
      CREATE REQUIRED PROPERTY slug: std::str {
          SET readonly := true;
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::regexp('[a-z0-9_]*');
      };
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::Tag {
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::QNA {
      CREATE REQUIRED MULTI LINK linkedTags: default::Tag;
      CREATE PROPERTY tags := (.linkedTags.name);
  };
  ALTER TYPE default::Tag {
      CREATE LINK qnas := (.<linkedTags[IS default::QNA]);
  };
  CREATE TYPE default::QNADraft {
      CREATE MULTI LINK linkedTags: default::Tag;
      CREATE PROPERTY tags := (.linkedTags.name);
      CREATE REQUIRED LINK thread: default::Thread {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY answer: std::str;
      CREATE PROPERTY prompt: std::str;
      CREATE PROPERTY question: std::str;
      CREATE PROPERTY title: std::str;
  };
  CREATE ABSTRACT TYPE default::QNASource {
      CREATE PROPERTY url: std::str;
  };
  CREATE TYPE discord::HelpChannel {
      CREATE REQUIRED PROPERTY channel_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE SCALAR TYPE embeddings::OpenAIEmbedding EXTENDING ext::pgvector::vector<1536>;
  CREATE TYPE embeddings::Section {
      CREATE REQUIRED PROPERTY embedding: embeddings::OpenAIEmbedding;
      CREATE INDEX ext::pgvector::ivfflat_cosine(lists := 3) ON (.embedding);
      CREATE REQUIRED PROPERTY checksum: std::str;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY path: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY tokens: std::int16;
  };
};
