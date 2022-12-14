import type { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/groups",
    failureRedirect: "/",
  });
};
