CREATE MIGRATION m1zuw6lcurkfuqjrnxlzzact7kpb6lectw2g64eigbdmvxw6zfbdhq
    ONTO m1jhlfbjwwavov5hfpkshc3jccpmiqxjoopiok7n4svuqtcywpapzq
{
  CREATE ABSTRACT TYPE default::Singleton {
      CREATE DELEGATED CONSTRAINT std::exclusive ON (true);
  };
  ALTER TYPE default::Prompt EXTENDING default::Singleton LAST;
};
