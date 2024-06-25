CREATE MIGRATION m1ffbr4sx5lcj2w75lmbrtifgeeayxmafq6vtupfch5u45cbkz5ooa
    ONTO m1btvm7r2k2be7kddj255gv7yn62dadqqfbmhbtiba5locjjvss3ka
{
  ALTER TYPE default::QNA {
      ALTER LINK linkedTags {
          RESET OPTIONALITY;
      };
  };
};
