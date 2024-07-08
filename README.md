This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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
