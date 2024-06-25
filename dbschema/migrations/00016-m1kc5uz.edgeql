CREATE MIGRATION m1kc5uzvoapaqwlaewhjhb3hrcjwbprffvid6iugk2wktbw6th4kcq
    ONTO m1rg4bwu44tzwddafjmdgdbvtul6zwbqhgpekclkszeyncvdmqoy7q
{
  ALTER TYPE default::QNA {
      CREATE INDEX fts::index ON ((fts::with_options(.title, language := fts::Language.eng), fts::with_options(.question, language := fts::Language.eng), fts::with_options(.answer, language := fts::Language.eng)));
  };
};
