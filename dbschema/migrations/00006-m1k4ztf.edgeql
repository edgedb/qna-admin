CREATE MIGRATION m1k4ztfd5ithpkzvdgw33sef7nwbgosuerwdcu3twlxlyz7eglte6q
    ONTO m1ezwits3dust6gqf3c3r5saiwmbzrwa6ffu2teipbvcji2uqrs6qa
{
  CREATE GLOBAL default::current_moderator := (std::assert_single((SELECT
      default::Moderator {
          account,
          email
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
