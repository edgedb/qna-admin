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
    some on the help channels.

  So when someone run these commands the request will be sent to the interactions
  endpoint and will be handled there: HelpChannels and Threads in the database
  will be updated.

- `Admin Panel` UI where these threads are loaded, reviewed, updated and
  summarized into questions and answers. Only `moderators` has the ability to
  log in to the admin panel and moderate threads in order to create QNAs. We
  use `EdgeDB Auth` with Discord provider for this. During login we check if
  the user has `moderators` role inside the Discord EdgeDB server and he/she
  will be allowed to proceed only if the role is present.

  We also use `OpenAI` to help us summarize threads into QNAs.

  Check both the code for the Admin panel and the [schema folder](https://github.com/edgedb/qna-admin/tree/main/dbschema)
  to understand better the whole flow.

## Getting Started

In order to be able to use this project for your own QNAs you will need to set up few things.

> In the rest of the guide we assume for the `BASE_URL` value `http://localhost:3000`
> for local development, or in production the domain where this project is deployed.

## EdgeDB database

You need to link the project to your own EdgeDB DB. Firstly decide is it going to be local instance or cloud one. For the local instance

## EdgeDB Auth

You need to set up the EdgeDB Auth extension. Open the `EdgeDB UI` with typing `edgedb ui` in the project root. Cloud instances you can also directly open at https://cloud.edgedb.com/. Provide the CONFIG: `auth_signing_key`, `token_time_to_live` and `allowed_redirect_urls` are required. For `allowed_redirect_urls` provide `BASE_URL`.

In the PROVIDERS section choose Discord as a provider. You need to get
`client_id` and `secret` from the Discord application which you can find under OAuth2 section in [Discord developer portal](https://discord.com/developers/applications). If you still haven't created Discord developer account and the app you can check [their quickstart](https://discord.com/developers/docs/quick-start/getting-started) tutorial. Here you can also see screenshots of various parts of the Discord development UI.

On PROVIDERS screen you also need to enter LOGIN UI data. For `redirect_to` use `{BASE_URL}/auth/builtin/callback`. For `redirect_to_on_signup` use `{BASE_URL}auth/builtin/callback?isSignUp=true`

For the `additional_scope` enter `email guilds.members.read identify`. More about why we need scopes and what are available ones you can find inside [OAuth2 section](https://discord.com/developers/docs/topics/oauth2) of the Discord docs.

## Discord Application

As mentioned in the previous step you will need a Discord bot application. To do this follow [Discord guide](https://discord.com/developers/docs/quick-start/getting-started). Once you create it navigate to the "General Information" page and look for `INTERACTIONS ENDPOINT URL`. Populate this field with `{ADMIN_PANEL_DOMAIN_URL}/api/interactions` for production. This is the path where the interactions endpoint is located inside this project (where are the handlers for previously mentioned Discord slash commands). Of course on this screen you should also add the bot name and icon. These will come handy later when you add the bot to your Discord server.

For local development is a bit trickier, we can't just provide localhost URL. You need to expose your local server to the internet under HTTPS URL and for this you can use Ngrok. Follow their simple [guide](https://ngrok.com/docs/getting-started/) to create and connect the account. Once your local server is online copy the provided Ngrok URL inside Discord interactions endpoint.

On the Installation page chose `Guild install` as the Authorization method since our bot is meant to be used within specific guilds (servers).

In OAuth2 section Redirects url has to be provided. You can find it in the EdgeDB UI Auth section inside CONFIG panel: `OAuth callback endpoint`.

### OpenAI API key

Lastly, you need to create an [OpenAI account](https://platform.openai.com/signup) or [sign in](https://platform.openai.com/login). Next, navigate to the [API key page](https://platform.openai.com/api-keys) and "Create new secret key". You can find more info in the [OpenAI quickstart](https://platform.openai.com/docs/quickstart) guide.

### Environment variables

Check the Deployment section below. The same env vars you have to provide for local development.

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Add the Bot to the Discord Server

Great. You have created the bot, Admin panel is running and interactions endpoint is ready to receive requests from the Discord server.
You need to connect the bot with the Discord server you want to use bot with. Navigate to OAuth2 URL Generator section on discord developer portal and check `bot` and `application.commands` boxes. Copy and open in the new browser window the generated URL at the bottom of the page. This will open the Discord window asking you to which Discord servers you want to add the bot. Choose the right one. Now when you right click on your server inside Discord app and open Server Settings -> Integrations you will see that your bot is added. When you click on the bot the window will open where you can see (and update) roles and channels that can use your bot commands. No commands are visible because you still didn't load them.

This is done by running the [script](https://github.com/edgedb/qna-admin/blob/main/app/lib/discord/scripts/registerCommands.ts). You have to run the `registerCommands` script on your local machine in order to load commands (`/help-channels` and `/helpful`). Once this is done you can

## Deploying

Since this project contains both the QNA admin panel and Discord bot implementation it
is not advisable to deploy it on Vercel since Vercel uses serverless functions
for route handlers, [learn more](https://vercel.com/guides/can-i-deploy-discord-bots-to-vercel).
Because of this we are self-hosting this project on AWS.

### Environment variables

This project requires the following environment variables:

- `BASE_URL`: This is the URL where the admin panel is deployed. It is needed for setting up the authentication.

- `EDGEDB_INSTANCE`: You can obtain this value by running the command `edgedb project info` in the project root. You can also find it in the cloud EdgeDB UI at `https://cloud.edgedb.com/org/{org_name}/instance/{instance_name}`. You will see in the left sidebar the section "Getting Started". There you will find the instance name.

- `EDGEDB_SECRET_KEY`: You need to generate this key. You can do it by running `edgedb cloud secretkey create` in the project root, or navigating to the same page and section where you got the instance name.

- `OPENAI_KEY`: We use OpenAI for helping us generate summarized QNAs out of all data we provide to the GPT. You can find the Secret API key on the [API key page](https://platform.openai.com/api-keys) of your OpenAI project.

- `DISCORD_CLIENT_ID`: Navigate to [Discord developer portal](https://discord.com/developers/applications). Open your bot app. Once you are there, on the "General Information" page you will find the APPLICATION ID.

- `DISCORD_CLIENT_PUBLIC_KEY`: This is just under the client (application) ID in the Discord developer portal.

- `DISCORD_TOKEN`: It is needed for authenticating users on admin panel with Discord. It can be found on Discord developer portal too in the OAuth2 section of the app.

- `DISCORD_GUILD_ID`: This is your Discord server ID. You can find it when you go to the Discord chat app and right click on your server icon. The popup window will show, at the bottom of it is "Copy Server ID" option.

- `REVIEW_CHANNEL_ID`: We have the special private channel in EdgeDB server where we get notifications about all thread recommendations. It's value can be obtained the same way as a the guild id, by right clicking on the channel name, and clicking on the "Copy channel ID" option in the opened popup.

If you use Discord website, you can find the guild ID and the review channel ID in the URL. First slug after the `https://discord.com/channels/` is always the opened server ID, and the second slug is the opened channel ID.

- `DISCORD_MODERATION_ACCESS_ROLES`: We narrow down using the admin panel only to users with certain roles. You need to get IDs of all the roles you want to allow here. This is done by right clicking on the server icon, choosing Server Settings and choosing Roles. Once you open the Roles panel you can either right click on the role or click on tree docs to copy the Role ID.

### Build command

Build command is `next dev` or `npm run dev`.
