import { redirect } from "@remix-run/server-runtime";
import { getWeek } from "~/utilities/dates.server";

export async function loader() {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeek(now);
  return redirect(`/settings/${year}/${week}`);
}
