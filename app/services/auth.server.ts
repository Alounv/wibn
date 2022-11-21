import { Authenticator } from "remix-auth";
import type { User } from "~/models/user.server";
import { getUserByEmail } from "~/models/user.server";
import { createUser } from "~/models/user.server";
import { verifyLogin } from "~/models/user.server";
import { getUserByEmailOrCreate } from "~/models/user.server";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "~/services/session.server";
import invariant from "tiny-invariant";
import { FormStrategy } from "remix-auth-form";

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
    includeGrantedScopes: true,
    accessType: "offline",
    scope:
      "email https://www.googleapis.com/auth/calendar.freebusy https://www.googleapis.com/auth/calendar.calendarlist.readonly",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.info({
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      extraParams: !!extraParams,
      profile: !!profile,
    });
    return getUserByEmailOrCreate({
      email: profile.emails[0].value,
      refreshToken,
      accessToken,
    });
  }
);

const formStrategy = new FormStrategy(async ({ form }) => {
  let email = form.get("email");
  let password = form.get("password");

  invariant(typeof email === "string", "username must be a string");
  invariant(email.length > 0, "username must not be empty");
  invariant(typeof password === "string", "password must be a string");
  invariant(password.length > 0, "password must not be empty");

  const user = await verifyLogin(email, password);
  invariant(user, "Invalid email or password");
  return user;
});

const formStrategySignin = new FormStrategy(async ({ form }) => {
  let email = form.get("email");
  let password = form.get("password");

  invariant(typeof email === "string", "username must be a string");
  invariant(email.length > 0, "username must not be empty");
  invariant(typeof password === "string", "password must be a string");
  invariant(password.length > 0, "password must not be empty");

  const existingUser = await getUserByEmail(email);
  invariant(!existingUser, "A user already exists with this email");

  const user = await createUser({ email, password });
  return user;
});

authenticator.use(googleStrategy);
authenticator.use(formStrategy, "user-pass");
authenticator.use(formStrategySignin, "user-pass-signin");
