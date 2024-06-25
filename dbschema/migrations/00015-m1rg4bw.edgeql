CREATE MIGRATION m1rg4bwu44tzwddafjmdgdbvtul6zwbqhgpekclkszeyncvdmqoy7q
    ONTO m1cqrslqbewmawkm3ji5ixm2b4nj3yyjr2weqct362r6jyxalwdvwa
{
  ALTER TYPE default::QNA {
      ALTER LINK linkedTags {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::QNADraft {
      ALTER LINK linkedTags {
          ON TARGET DELETE ALLOW;
      };
  };
};
