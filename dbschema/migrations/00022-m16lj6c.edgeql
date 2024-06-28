CREATE MIGRATION m16lj6c5e54pncdpwaysltetti3a6b36yrl5bewfwcf3y3riog4koa
    ONTO m1hgzemgedeqv7wnbvquvm5uk5qu57pu6bbwb4bl5u65bvn65ma5qq
{
  ALTER TYPE default::Thread {
      DROP PROPERTY first_msg;
  };
};
