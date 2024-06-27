CREATE MIGRATION m1hgzemgedeqv7wnbvquvm5uk5qu57pu6bbwb4bl5u65bvn65ma5qq
    ONTO m1zuw6lcurkfuqjrnxlzzact7kpb6lectw2g64eigbdmvxw6zfbdhq
{
  ALTER TYPE default::Tag {
      ALTER PROPERTY disabled {
          SET default := false;
      };
  };
};
