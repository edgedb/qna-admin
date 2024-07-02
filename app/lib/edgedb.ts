import createClient from "edgedb";
import createAuth from "@edgedb/auth-nextjs/app";

export const client = createClient();

export const auth = createAuth(client, {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  authRoutesPath: "api/auth",
});
