CREATE MIGRATION m12pcplzxccw7baxunmo656jvyc4dbbg2hpkiz3v4ei2wtvnkcyo2a
    ONTO m1zszshrhlagx43sepgjsw47vy7lgxibjarg7t72ypb6m345oiiygq
{
  ALTER TYPE default::QNADraft {
      CREATE INDEX fts::index ON ((fts::with_options(.title, language := fts::Language.eng), fts::with_options(.question, language := fts::Language.eng), fts::with_options(.answer, language := fts::Language.eng)));
  };
  ALTER TYPE default::Thread {
      CREATE PROPERTY first_msg := (((SELECT
          .messages 
      LIMIT
          1
      )).displayed_content);
  };
};
