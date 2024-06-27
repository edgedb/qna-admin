"use server";

import { REST } from "@discordjs/rest";
import { Routes, APIGuildMember, APIUser } from "discord-api-types/v10";
import { client } from "../../lib/edgedb";
import { discordGuildId, authorizedRoleIds } from "../../envs";
import { getCurrentUser } from "./queries/getCurrentUser.query";

export async function discordSignin({
  discordToken,
  authToken,
}: {
  discordToken: string;
  authToken: string;
}) {
  const discordClient = new REST({ authPrefix: "Bearer" }).setToken(
    discordToken
  );

  const discordUser = (await discordClient.get(
    Routes.userGuildMember(discordGuildId)
  )) as APIGuildMember;

  if (!discordUser) {
    throw new Error("No guild member information for user");
  }

  if (!discordUser.roles.some((role) => authorizedRoleIds.includes(role))) {
    throw new Error("Discord user does not have any authorized roles");
  }

  const email = ((await discordClient.get(Routes.user())) as APIUser).email;

  return client.withGlobals({ "ext::auth::client_token": authToken }).execute(
    `insert default::Moderator {
      identity := assert_exists(global ext::auth::ClientTokenIdentity),
      email := <str>$email,
      account := (insert discord::User {
        user_id := <str>$user_id,
        name := <str>$username
      } unless conflict on .user_id else (
        select discord::User
      ))
    }
    unless conflict on .identity else (
      select default::Moderator)`,
    {
      user_id: discordUser.user!.id,
      email,
      username: discordUser.nick ?? discordUser.user!.username,
    }
  );
}

export async function getCurrentModerator(authToken: string) {
  const clientWithGlobals = client.withGlobals({
    "ext::auth::client_token": authToken,
  });

  return getCurrentUser(clientWithGlobals);
}
