CREATE MIGRATION m1uqz6wc4ohamw3kw4he65jfuvbdpsg27vsczpacmvzgfnxxwezxpa
    ONTO m12hugcockmaa2qahgmcjrvqehkjqgy6vov4io57oaapm4x374dkda
{
  CREATE TYPE default::Prompt {
      CREATE REQUIRED PROPERTY content: std::str;
  };
  ALTER TYPE default::Thread {
      DROP PROPERTY title;
  };
};
