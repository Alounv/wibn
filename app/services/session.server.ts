import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "./auth.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function requireUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: `/login?${searchParams}`,
  });
  return user;
}

export let { getSession, commitSession } = sessionStorage;
