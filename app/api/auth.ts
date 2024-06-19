"use server";

import { REST } from "@discordjs/rest";
import { Routes, APIGuildMember, APIUser } from "discord-api-types/v10";
import { client } from "../edgedb";
import { discordGuildId, authorizedRoleIds } from "../envs";

// export async function discordSignin(params: {
//   discordToken: string;
//   authToken: string;
// }) {
//   const res = await fetch(new URL("/auth/signin", "http://localhost:3000"), {
//     method: "POST",
//     body: JSON.stringify({ params }),
//     headers: {
//       Authorization: `Bearer ${process.env.QNA_API_SECRET}`,
//       Accept: "application/json, text/plain, */*",
//       "Content-Type": "application/json",
//     },
//   });

//   if (res.ok) {
//     return res.json();
//   }

//   throw new Error(
//     `api call failed with status ${res.status}: ${await res.text()}`
//   );
// }

// export async function getCurrentUser(authToken: string) {
//   const res = await fetch(
//     new URL("/auth/currentUser", "http://localhost:3000"),
//     {
//       method: "GET",
//       body: JSON.stringify({ authToken }),
//       headers: {
//         Authorization: `Bearer ${process.env.QNA_API_SECRET}`,
//         Accept: "application/json, text/plain, */*",
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (res.ok) {
//     return res.json();
//   }

//   throw new Error(
//     `api call failed with status ${res.status}: ${await res.text()}`
//   );
// }

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

export async function getCurrentUser(authToken: string) {
  return client
    .withGlobals({ "ext::auth::client_token": authToken })
    .querySingle(
      `select (global current_moderator) {
        email,
        account: {
          name, user_id
        }
      } `
    );
}
