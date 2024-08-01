FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV BASE_URL https://localhost:3000
ENV EDGEDB_INSTANCE edgedb/qna

RUN --mount=type=secret,id=OPENAI_KEY \
    sed -i "s/OPENAI_KEY=/OPENAI_KEY=$(cat /run/secrets/OPENAI_KEY)/" .env.production

RUN --mount=type=secret,id=DISCORD_TOKEN \
    sed -i "s/DISCORD_TOKEN=/DISCORD_TOKEN=$(cat /run/secrets/DISCORD_TOKEN)/" .env.production

RUN --mount=type=secret,id=DISCORD_CLIENT_PUBLIC_KEY \
    sed -i "s/DISCORD_CLIENT_PUBLIC_KEY=/DISCORD_CLIENT_PUBLIC_KEY=$(cat /run/secrets/DISCORD_CLIENT_PUBLIC_KEY)/" .env.production

RUN --mount=type=secret,id=DISCORD_GUILD_ID \
    sed -i "s/DISCORD_GUILD_ID=/DISCORD_GUILD_ID=$(cat /run/secrets/DISCORD_GUILD_ID)/" .env.production

RUN --mount=type=secret,id=DISCORD_MODERATION_ACCESS_ROLES \
    sed -i "s/DISCORD_MODERATION_ACCESS_ROLES=/DISCORD_MODERATION_ACCESS_ROLES=$(cat /run/secrets/DISCORD_MODERATION_ACCESS_ROLES)/" .env.production

RUN --mount=type=secret,id=REVIEW_CHANNEL_ID \
    sed -i "s/REVIEW_CHANNEL_ID=/REVIEW_CHANNEL_ID=$(cat /run/secrets/REVIEW_CHANNEL_ID)/" .env.production

RUN --mount=type=secret,id=DISCORD_CLIENT_ID \
    sed -i "s/DISCORD_CLIENT_ID=/DISCORD_CLIENT_ID=$(cat /run/secrets/DISCORD_CLIENT_ID)/" .env.production

RUN --mount=type=secret,id=EDGEDB_SECRET_KEY \
    sed -i "s/EDGEDB_SECRET_KEY=/EDGEDB_SECRET_KEY=$(cat /run/secrets/EDGEDB_SECRET_KEY)/" .env.production

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js