CREATE MIGRATION m1hxgecbmljasiuyxh5ewksb3z5jwmsxi5k7nuzvrhlhuk4c4i2yza
    ONTO m13d6xzx42og3ktq2miaosols7rhdz753f2uvqkjtrmdo4xwwge6ea
{
  ALTER TYPE default::Author RENAME TO default::User;
  CREATE TYPE default::Moderator {
      CREATE REQUIRED MULTI LINK accounts: default::User {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::current_moderator := (std::assert_single((SELECT
      default::Moderator {
          accounts
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  ALTER TYPE default::Revision {
      ALTER LINK author {
          SET TYPE default::Moderator USING (.author[IS default::Moderator]);
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY user_id: std::str {
          SET REQUIRED USING (<std::str>{123456789});
          CREATE DELEGATED CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE discord::Message {
      DROP INDEX ON (.message_id);
  };
  ALTER TYPE discord::ReviewCard {
      DROP INDEX ON (.message_id);
  };
  ALTER TYPE discord::Thread {
      DROP INDEX ON (.thread_id);
  };
  ALTER TYPE discord::User {
      DROP INDEX ON (.user_id);
      ALTER PROPERTY user_id {
          ALTER CONSTRAINT std::exclusive {
              DROP OWNED;
          };
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
};
