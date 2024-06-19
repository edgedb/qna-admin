CREATE MIGRATION m1zszshrhlagx43sepgjsw47vy7lgxibjarg7t72ypb6m345oiiygq
    ONTO m1gozli3nkyhtv6jz4n3cz3jkbxbpt5r5i2bzyn5qhcjtnswjmivza
{
  ALTER TYPE default::Message {
      CREATE INDEX fts::index ON (fts::with_options(.content, language := fts::Language.eng));
  };
  ALTER TYPE default::Thread {
      CREATE INDEX fts::index ON (fts::with_options(.title, language := fts::Language.eng));
  };
};
