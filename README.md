# QNA

This project is designed to create Question and Answer entries for the [EdgeDB docs website](https://docs.edgedb.com/q+a) by leveraging discussions from the EdgeDB Discord server. It combines a Discord bot, an EdgeDB database, and a Next.js web application with OpenAI integration to streamline the process of identifying helpful discussions and transforming them into concise Q&A entries.

## System overview

1. **Discord Bot**: Allows moderators to mark helpful threads using the `/helpful` command.

   - Processes interactions from Discord
   - Saves marked threads to the EdgeDB database.

2. **EdgeDB Database**: Data storage.

   - Stores marked threads from Discord.
   - Stores processed Q&A entries.
   - Provides user authentication.

3. **Next.js Web App**: Provides a web interface for moderators to review and process marked threads.

   - Integrates with OpenAI to assist in summarizing threads into Q&A format.
   - Allows moderators to edit and finalize Q&A entries.

## Moderator Workflow

1. **Identifying Helpful Threads**:

   - Moderators use the `/helpful` command in designated Discord channels to mark insightful discussions.
   - The Discord bot saves these marked threads to the EdgeDB database.

2. **Reviewing and Processing Threads**:

   - Moderators sign into the Admin app using EdgeDB Auth with the Discord OAuth provider.
   - The Admin app loads marked threads from the EdgeDB database for review.

3. **Generating Q&A Entries**:

   - Moderators select a thread to process.
   - The system uses OpenAI to generate an initial Q&A summary from the thread content.
   - Moderators can edit and refine the AI-generated summary.

4. **Finalizing and Storing Q&As**:
   - Once satisfied, moderators save the finalized Q&A entry to the EdgeDB database.
   - These entries become available for use on the EdgeDB docs website.

This Next.js project, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and using the [App Router](https://nextjs.org/docs/app), seamlessly integrates these components to create a streamlined workflow for generating high-quality Q&A content from community discussions.

For a deeper understanding of the implementation, refer to the [Discord bot code](https://github.com/edgedb/qna-admin/tree/main/app/lib/discord), the [Admin app code](https://github.com/edgedb/qna-admin/tree/main/app), and the [database schema](https://github.com/edgedb/qna-admin/tree/main/dbschema).

## Getting Started

This section guides you through the process of setting up this project for your own community. By following these instructions, you'll be able to create a system that captures valuable discussions from your Discord server and transforms them into useful Q&A content.

> In the rest of this section we assume `http://localhost:3000` for the `BASE_URL` for local development, or the domain where this project is deployed for production.

### Prerequisites

- Access to an EdgeDB v5 or newer instance. (Our [hosted cloud](https://www.edgedb.com/cloud) is a great option!)
- A Discord developer account with permissions to create a bot
- An OpenAI account with API access

### Setup steps

1. **EdgeDB Database Setup**

   Initialize the project as an EdgeDB project:

   **Local**:

   ```
   edgedb project init
   ```

   **Cloud**:

   ```
   edgedb cloud login
   edgedb instance create <your-github-org>/<your-instance-name>
   edgedb project init --server-instance <your-github-org>/<your-instance-name>
   ```


2. **EdgeDB Auth Configuration**

   a. Open EdgeDB UI:
      ```
      edgedb ui
      ```

   b. In the Auth section, configure the following:
      - `auth_signing_key`
      - `token_time_to_live`
      - `allowed_redirect_urls` (set to your `BASE_URL`)

   c. Choose Discord as the provider and configure:
      - `client_id` and `secret` (obtain from Discord Developer Portal)
      - Set `additional_scope` to `email guilds.members.read identify`. See the [OAuth2 section](https://discord.com/developers/docs/topics/oauth2) of the Discord docs for more information about scopes.

3. **Local Development with ngrok** (for Discord bot interactions)

   a. Set up an ngrok account and install the ngrok CLI.

   b. Start your local server and run:
      ```
      ngrok http 3000
      ```

   c. Save the provided ngrok URL for use in the next step.

4. **Discord Application Setup**

   a. Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications).

   b. In the "General Information" page, set the "INTERACTIONS ENDPOINT URL" to:
      - Local development: `{NGROK_URL}/api/interactions`
      - Production: `{DEPLOYED_APP_URL}/api/interactions`

   c. On the "OAuth2" page, add the "OAuth callback endpoint" from EdgeDB UI Auth section.

5. **OpenAI API Setup**

   Create a new secret key by navigating to the [API key page](https://platform.openai.com/api-keys). You can find more info in the [OpenAI quickstart](https://platform.openai.com/docs/quickstart) guide.

6. **Environment Variables**

   Create a `.env.local` file in the project root with the following variables:
   ```
   BASE_URL=http://localhost:3000
   OPENAI_KEY=your_openai_api_key
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_PUBLIC_KEY=your_discord_public_key
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_GUILD_ID=your_discord_server_id
   REVIEW_CHANNEL_ID=your_review_channel_id
   DISCORD_MODERATION_ACCESS_ROLES=role_id1,role_id2
   EDGEDB_CLIENT_TLS_SECURITY=insecure
   ```

   - `BASE_URL`: The URL where your admin panel is deployed. Use `http://localhost:3000` for local development.

   - `OPENAI_KEY`: Find this on the [API keys page](https://platform.openai.com/api-keys) of your OpenAI account.

   - `DISCORD_CLIENT_ID`: In the [Discord Developer Portal](https://discord.com/developers/applications), select your app and find this as "APPLICATION ID" on the "General Information" page.

   - `DISCORD_CLIENT_PUBLIC_KEY`: Located just below the APPLICATION ID in the Discord Developer Portal.

   - `DISCORD_TOKEN`: Found on the "Bot" page in the Discord Developer Portal. You may need to click "Reset Token" to reveal it.

   - `DISCORD_GUILD_ID`: Right-click on your Discord server icon and select "Copy Server ID". If using Discord in a browser, this is the first number in the URL after `https://discord.com/channels/`.

   - `REVIEW_CHANNEL_ID`: Right-click on the channel name in Discord and select "Copy Channel ID". In a browser, this is the second number in the URL when viewing the channel.

   - `DISCORD_MODERATION_ACCESS_ROLES`: Comma-separated list of role IDs that can access the admin panel. To get a role ID, go to Server Settings > Roles, then right-click on a role and select "Copy Role ID".

   For production, specify the appropriate [connection parameters](https://docs.edgedb.com/database/reference/connection), remove `EDGEDB_CLIENT_TLS_SECURITY` and update `BASE_URL` to match your deployed application's base URL.

   - `EDGEDB_INSTANCE`: Run `edgedb project info` in the project root, or find it in the EdgeDB Cloud UI under "Getting Started" in the left sidebar.

   - `EDGEDB_SECRET_KEY` (EdgeDB Cloud only): Generate this key by running `edgedb cloud secretkey create` in the project root, or find it in the same EdgeDB Cloud UI section as the instance name.

   Here is an example using EdgeDB cloud:

   ```
   BASE_URL=https://example.com
   OPENAI_KEY=your_openai_api_key
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_PUBLIC_KEY=your_discord_public_key
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_GUILD_ID=your_discord_server_id
   REVIEW_CHANNEL_ID=your_review_channel_id
   DISCORD_MODERATION_ACCESS_ROLES=role_id1,role_id2
   EDGEDB_INSTANCE=your-github-org/your-instance-name
   EDGEDB_SECRET_KEY=your_edgedb_cloud_secret_key
   ```

7. **Install Dependencies and Run the Development Server**

   ```bash
   npm install
   npm run dev
   ```

   The project should now be running on [http://localhost:3000](http://localhost:3000).

8. **Add the Bot to Your Discord Server**

   a. In the Discord Developer Portal, go to the "Installation" settings.

   b. Select "Guild Install" since the bot is meant to be used within a specific guild (server).

   c. Select "Discord Provided Link" for the "Install Link", and open the provided URL in a separate browser window or tab.

   d. Select your server to add the bot.

   e. Double-check that the bot shows up in your Server Settings > Integrations.

9. **Register Bot Commands**

   Run the following command to register the bot's slash commands:
   ```
   npm run commands
   ```

10. **Set Up Help Channels**

    In your Discord server, use the `/help-channels add` command in each channel you want to monitor for helpful threads.

You should now have a fully functioning QnA Admin Panel with an integrated Discord bot!

# Deploying

This application is a Next.js app that runs as a Node.js application and integrates with a Discord bot. When deploying, it's crucial to choose an environment that meets specific requirements for optimal performance and functionality.

## Deployment Requirements

1. **Node.js Support**: 
   - The deployment environment must support Node.js version 18 or higher.
   - Ensure the platform can run a long-lived Node.js process.

2. **Non-Serverless Architecture**:
   - Serverless platforms like Vercel are not suitable for this application. As noted in the [Vercel documentation](https://vercel.com/guides/can-i-deploy-discord-bots-to-vercel), Discord bots require long-running processes, which serverless architectures don't support.
   - Choose a platform that allows for continuous runtime of the application.

3. **Environment Variable Support**:
   - The chosen platform must allow setting and securely storing environment variables.
   - Refer to the "Getting Started" section for the list of required environment variables.

4. **Build and Start Commands**:
   - The platform should allow specifying custom build and start commands:
     - Build command: `next build`
     - Start command: `next start`

5. **HTTPS Support**:
   - For production deployments, HTTPS is crucial for security, especially when handling Discord authentication.
   - Either choose a platform with built-in HTTPS support or be prepared to configure it manually (e.g., using a reverse proxy like Nginx with Let's Encrypt).

## Post-Deployment Steps

After successfully deploying your application, ensure you update the Discord Application Settings (if you are sharing the same Discord Application between development and production) to reflect the deployed application's URL in the "INTERACTIONS ENDPOINT URL" in the Discord Developer Portal.