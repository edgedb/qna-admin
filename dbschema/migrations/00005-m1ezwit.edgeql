CREATE MIGRATION m1ezwits3dust6gqf3c3r5saiwmbzrwa6ffu2teipbvcji2uqrs6qa
    ONTO m1hxgecbmljasiuyxh5ewksb3z5jwmsxi5k7nuzvrhlhuk4c4i2yza
{
  DROP GLOBAL default::current_moderator;
  ALTER TYPE default::Moderator {
      CREATE REQUIRED LINK account: default::User {
          SET REQUIRED USING (SELECT
              .accounts 
          LIMIT
              1
          );
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER LINK accounts {
          DROP CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Moderator {
      DROP LINK accounts;
  };
  ALTER TYPE default::Moderator {
      CREATE REQUIRED PROPERTY email: std::str {
          SET REQUIRED USING ('email@example.com');
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
