CREATE MIGRATION m1btvm7r2k2be7kddj255gv7yn62dadqqfbmhbtiba5locjjvss3ka
    ONTO m12pcplzxccw7baxunmo656jvyc4dbbg2hpkiz3v4ei2wtvnkcyo2a
{
  ALTER TYPE default::Thread {
      ALTER PROPERTY first_msg {
          USING (((SELECT
              .messages 
          LIMIT
              1
          )).content);
      };
  };
  ALTER TYPE default::Message {
      DROP PROPERTY displayed_content;
      DROP LINK revisions;
  };
  DROP TYPE default::QNASource;
  DROP TYPE default::Revision;
};
