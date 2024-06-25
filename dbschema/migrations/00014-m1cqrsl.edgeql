CREATE MIGRATION m1cqrslqbewmawkm3ji5ixm2b4nj3yyjr2weqct362r6jyxalwdvwa
    ONTO m1wxvv5mnr4eyn7kbr2tmbbu2342q34nrosro5zveauturv7ngvaqq
{
  ALTER TYPE default::Thread {
      CREATE PROPERTY title: std::str;
  };
};
