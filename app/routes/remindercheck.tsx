import type { LoaderArgs } from "@remix-run/node";

export async function loader() {
  await checkGroupsForReminder();
}
