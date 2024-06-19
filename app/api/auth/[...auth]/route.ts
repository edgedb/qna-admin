import { redirect } from "next/navigation";
import { auth } from "../../../edgedb";
import { discordSignin } from "../../auth";

const { GET, POST } = auth.createAuthRouteHandlers({
  async onOAuthCallback({ error, tokenData }) {
    if (!error && tokenData) {
      try {
        await discordSignin({
          authToken: tokenData.auth_token,
          discordToken: tokenData.provider_token!,
        });
      } catch (e) {
        error = e instanceof Error ? e : new Error(String(e));
      }
    }

    console.error(error);

    redirect("/threads" + (error ? `?error=${error.message}` : ""));
  },
  onSignout() {
    redirect("/threads");
  },
});

export { GET, POST };
