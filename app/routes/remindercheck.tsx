import { checkGroupsForReminder } from "~/services/check.server";

export async function loader() {
  await checkGroupsForReminder();
}
