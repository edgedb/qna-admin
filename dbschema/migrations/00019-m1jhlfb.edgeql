CREATE MIGRATION m1jhlfbjwwavov5hfpkshc3jccpmiqxjoopiok7n4svuqtcywpapzq
    ONTO m1uqz6wc4ohamw3kw4he65jfuvbdpsg27vsczpacmvzgfnxxwezxpa
{
  ALTER TYPE default::Tag {
      CREATE PROPERTY disabled: std::bool;
  };
};
