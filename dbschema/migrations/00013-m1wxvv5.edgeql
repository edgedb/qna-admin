CREATE MIGRATION m1wxvv5mnr4eyn7kbr2tmbbu2342q34nrosro5zveauturv7ngvaqq
    ONTO m1qqgxomez57ufjrydxzetbgqdhkix655otsatahq5xq4ir2nrz2eq
{
  ALTER TYPE default::QNA {
      CREATE REQUIRED PROPERTY title: std::str {
          SET REQUIRED USING (<std::str>'\ndefault');
      };
  };
  ALTER TYPE default::QNADraft {
      ALTER LINK linkedTags {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY title: std::str;
  };
};
