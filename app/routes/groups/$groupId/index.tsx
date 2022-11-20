import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getCurrentWeek } from "~/utilities/dates.server";

export async function loader({ params: { groupId } }: LoaderArgs) {
  invariant(groupId, "groupId not found");
  const { year, week } = getCurrentWeek();
  return redirect(`/groups/${groupId}/${year}/${week}`);
}
