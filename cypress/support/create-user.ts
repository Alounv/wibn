// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { installGlobals } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

import { createUser } from "~/models/user.server";

installGlobals();

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error("email required for login");
  }
  if (!email.endsWith("@example.com")) {
    throw new Error("All test emails must end in @example.com");
  }

  const user = await createUser(email, "myreallystrongpassword");

  const request = new Request("test://test");

  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
}

createAndLogin(process.argv[2]);
