# QNA Admin Panel with Discord Bot

This project is used for creating QNA examples that you can find on
[EdgeDB docs website](https://docs.edgedb.com/q+a). The data used for these
QNAs is taken from Discord chats inside various channels of EdgeDB Discord server.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), and using [App Router](https://nextjs.org/docs/app).

It consists of 2 parts:

- `Discord Bot` which is used to mark some threads in Discord as important
  (helpful) and save them in the EdgeDB database. For this we use Discord [slash commands](https://discord.com/developers/docs/interactions/application-commands). Commands can be run only by certain users inside EdgeDB
  Discord server. These users have a special [Role](https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101)
  `moderators` inside the EdgeDB guild (server). The bot code is contained in
  this [folder](https://github.com/edgedb/qna-admin/tree/main/app/lib/discord).
  The API for command interactions is inside the [route handler](https://github.com/edgedb/qna-admin/blob/main/app/api/interactions/route.ts).

  The bot has 2 commands:

  - `/help-channels` to add, list or remove some channel as the channel whose
    threads can be marked as important.
  - `/helpful` the command that actually marks a thread as important inside
    some of the help channels.

  So when someone run these commands the request will be sent to the interactions
  endpoint and will be handled there: HelpChannels and Threads in the database
  will be updated.

- `Admin Panel` UI where these threads are loaded, reviewed, updated and
  summarized into questions and answers. Only `moderators` have the ability to
  log in to the admin panel and moderate threads in order to create QNAs. We
  use `EdgeDB Auth` with Discord provider for this. During login we check if
  the user has `moderators` role inside the Discord EdgeDB server and he/she
  will be allowed to proceed only if the role is present.

  We also use `OpenAI` to help us summarize threads into QNAs.

  Check both the code for the Admin panel and the [schema folder](https://github.com/edgedb/qna-admin/tree/main/dbschema)
  to understand better the whole flow.

## Getting Started

In order to be able to use this project for your own QNAs you will need to set up few things.

> In the rest of the readme we assume `http://localhost:3000` for the `BASE_URL`
> for local development, or the domain where this project is deployed for production.

### EdgeDB database

You need to initialize a project as EdgeDB project and link it to the EdgeDB
instance. Check [quickstart guide](https://docs.edgedb.com/get-started/quickstart#initialize-a-project).
In the [edgedb project init docs](https://docs.edgedb.com/cli/edgedb_project/edgedb_project_init#edgedb-project-init)
you can also find how to link it to the cloud DB. For local development we recommend
creating new EdgeDB branch and maintain `main` branch for production.

### EdgeDB Auth

You need to set up the [EdgeDB Auth](https://docs.edgedb.com/guides/auth)
extension. Open the `EdgeDB UI` with typing `edgedb ui` in the project root.
Cloud instances you can also directly open at https://cloud.edgedb.com/.
Provide the CONFIG: `auth_signing_key`, `token_time_to_live` and `allowed_redirect_urls`
are required. For `allowed_redirect_urls` provide `BASE_URL`.

In the PROVIDERS section choose Discord as a provider. You need to get
`client_id` and `secret` from the Discord application which you can find under
OAuth2 section in [Discord developer portal](https://discord.com/developers/applications).
If you still haven't created Discord developer account and the app you can check
their [quickstart](https://discord.com/developers/docs/quick-start/getting-started)
tutorial.

For the `additional_scope` enter `email guilds.members.read identify`.
More about why we need scopes and what are available ones you can find inside
[OAuth2 section](https://discord.com/developers/docs/topics/oauth2) of the Discord docs.

### Discord Application

As mentioned in the previous step you will need a Discord bot application.
To do this follow [Discord guide](https://discord.com/developers/docs/quick-start/getting-started).
Once you create it navigate to the "General Information" page and look for `INTERACTIONS ENDPOINT URL`.
Populate this field with `{ADMIN_PANEL_DOMAIN_URL}/api/interactions` for production.
This is the path where the interactions endpoint is located inside this project
(where are the handlers for previously mentioned Discord slash commands).

For local development is a bit trickier, you can't just provide localhost URL.
You need to expose your local server to the internet under HTTPS URL and for this
you can use `Ngrok`. Follow their simple [guide](https://ngrok.com/docs/getting-started/)
to create and connect the account. Once your local server is online copy the
provided Ngrok URL inside Discord interactions endpoint (with `/api/interactions` at the end).
Interactions endpoint has to be verified, and for that you need to provide some env vars.
Go down to the Deployment section and provide `DISCORD_CLIENT_ID`,
`DISCORD_CLIENT_PUBLIC_KEY` and `DISCORD_TOKEN`.

On the "Installation page" you can only leave `Guild install` as the Authorization
method since our bot is meant to be used within specific guilds (servers).

On the "OAuth2 page" Redirects url has to be provided. You can find it in the
EdgeDB UI Auth section inside CONFIG panel: `OAuth callback endpoint`.

### OpenAI API key

Lastly, you need to create an [OpenAI account](https://platform.openai.com/signup)
or [sign in](https://platform.openai.com/login). Next, navigate to the [API key page](https://platform.openai.com/api-keys)
and "Create new secret key". You can find more info in the
[OpenAI quickstart](https://platform.openai.com/docs/quickstart) guide.

### Environment variables

You should be ready to run the project now on localhost with the vars already
provided. The rest you can add later. Anyway, whenever you need some help with
env vars head down to the Deployment section below. The same env vars you have
to provide for local development.

> For local development only you have to add one more env var: `TLS_SECURITY=insecure`.

## Install dependencies and run the development server

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The project should run on [http://localhost:3000](http://localhost:3000).

## Add the Bot to the Discord Server

Great. You have created the bot, Admin panel is running and interactions
endpoint is ready to receive requests from the Discord server. You need to
connect the bot with the Discord server you want to use bot with. Navigate to the
Installation page on Discord developer portal. For scopes inside Default
Install Settings add `application.commands` and `bot`. Copy the Install Link
from the same screen in the new browser window and choose the server you want
to add the bot to.

Now when you right click on your server inside Discord app and open Server
Settings -> Integrations you should see the bot there. Click on the bot to
open the window where you can see (and update) roles and channels that can
use your bot commands. Let's leave the defaults here, you can update it later
if you want. No commands are visible because you still didn't load them. You
can do this by running the [script](https://github.com/edgedb/qna-admin/blob/main/app/lib/discord/scripts/registerCommands.ts).
Run

```
npm run commands
```

in your terminal. Now you need to run `/help-channels add` inside channels you want to observe for
helpful threads. Make sure to add `REVIEW_CHANNEL_ID` env var to the list of
vars before running `/helpful`.

> In all the channels you intend to use commands, you have to see the bot online  
> in the channel's users list. If the channel is private you have to add the
> bot manually to the channel.

## Deploying

Since this project contains both the QNA admin panel and Discord bot implementation it
is not advisable to deploy it on Vercel since Vercel uses serverless functions
for route handlers, [learn more](https://vercel.com/guides/can-i-deploy-discord-bots-to-vercel).
Because of this we are self-hosting this project on AWS.

### Environment variables

This project requires the following environment variables:

- `BASE_URL`: This is the URL where the admin panel is deployed. It is needed
  for setting up the authentication.

- `EDGEDB_INSTANCE`: You can obtain this value by running the command

  ```
  edgedb project info
  ```

  in the project root. You can also find it in the cloud
  EdgeDB UI at `https://cloud.edgedb.com/org/{org_name}/instance/{instance_name}`.
  You will see in the left sidebar the section "Getting Started". There you
  will find the instance name.

- `EDGEDB_SECRET_KEY`: You need to generate this key. You can do it by running

  ```
  edgedb cloud secretkey create
  ```

  in the project root, or navigating to the same page and section where you got the instance name.

- `OPENAI_KEY`: We use OpenAI for helping us generate summarized QNAs out of
  all data we provide to the GPT. You can find the Secret API key on the
  [API key page](https://platform.openai.com/api-keys).

- `DISCORD_CLIENT_ID`: Navigate to [Discord developer portal](https://discord.com/developers/applications).
  Open your bot app. Once you are there, on the "General Information" page you
  will find the APPLICATION ID.

- `DISCORD_CLIENT_PUBLIC_KEY`: This is just under the APPLICATION ID
  in the Discord developer portal.

- `DISCORD_TOKEN`: It is needed for authenticating users on admin panel with
  Discord and for interactions endpoint. It can be found on Discord developer
  portal too on the "Bot" page (`Reset Token` button).

- `DISCORD_GUILD_ID`: This is your Discord server ID. You can find it when you
  go to the Discord app and right click on your server icon. The popup
  window will open, at the bottom of it is "Copy Server ID" option.

- `REVIEW_CHANNEL_ID`: We have the special channel in EdgeDB server where we get
  notifications about all thread recommendations. Its value can be obtained the
  same way as a the guild id, by right clicking on the channel name, and clicking
  on the "Copy channel ID" option in the opened popup. Create a channel inside
  your server that will serve as the Review channel.

  If you use Discord website, you can find the guild ID and the review channel ID
  in the URL. First slug after the `https://discord.com/channels/` is always the
  opened server ID, and the second slug is the opened channel ID.

- `DISCORD_MODERATION_ACCESS_ROLES`: We narrow down using the admin panel only
  to users with certain roles. You need to get IDs of all the roles you want to
  allow here. This is done by right clicking on the server icon, choosing Server
  Settings and choosing Roles. Once you open the Roles panel you can either
  right click on the role or click on tree docs to copy the Role ID.

### Build command

Build command is `next dev` or `npm run dev`.
