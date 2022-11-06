import { Authenticator } from "remix-auth";
import type { User } from "~/models/user.server";
import { getUserByEmailOrCreate } from "~/models/user.server";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "../session.server";
import invariant from "tiny-invariant";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } = process.env;

invariant(GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID must be set");
invariant(GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET must be set");
invariant(ORIGIN, "ORIGIN must be set");

export let authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${ORIGIN}/google/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.log(profile);
    return getUserByEmailOrCreate(profile.emails[0].value);
  }
);

authenticator.use(googleStrategy);
