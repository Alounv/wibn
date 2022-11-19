import { redirect } from "@remix-run/server-runtime";
import { getCurrentWeek } from "~/utilities/dates.server";

export async function loader() {
  const { year, week } = getCurrentWeek();
  return redirect(`/settings/${year}/${week}`);
}
