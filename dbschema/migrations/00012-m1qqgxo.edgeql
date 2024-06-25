CREATE MIGRATION m1qqgxomez57ufjrydxzetbgqdhkix655otsatahq5xq4ir2nrz2eq
    ONTO m1ffbr4sx5lcj2w75lmbrtifgeeayxmafq6vtupfch5u45cbkz5ooa
{
  ALTER TYPE default::QNA {
      DROP PROPERTY title;
  };
  ALTER TYPE default::QNADraft {
      DROP INDEX fts::index ON ((fts::with_options(.title, language := fts::Language.eng), fts::with_options(.question, language := fts::Language.eng), fts::with_options(.answer, language := fts::Language.eng)));
  };
  ALTER TYPE default::QNADraft {
      CREATE INDEX fts::index ON ((fts::with_options(.question, language := fts::Language.eng), fts::with_options(.answer, language := fts::Language.eng)));
      ALTER LINK linkedTags {
          ON TARGET DELETE ALLOW;
      };
      DROP PROPERTY title;
  };
  ALTER TYPE default::Thread {
      DROP INDEX fts::index ON (fts::with_options(.title, language := fts::Language.eng));
      DROP PROPERTY title;
  };
};
