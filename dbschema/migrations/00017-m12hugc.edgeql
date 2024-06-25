CREATE MIGRATION m12hugcockmaa2qahgmcjrvqehkjqgy6vov4io57oaapm4x374dkda
    ONTO m1kc5uzvoapaqwlaewhjhb3hrcjwbprffvid6iugk2wktbw6th4kcq
{
  ALTER TYPE default::Message {
      CREATE PROPERTY attachments: array<std::str>;
  };
  ALTER TYPE default::QNA {
      DROP PROPERTY slug;
  };
};
