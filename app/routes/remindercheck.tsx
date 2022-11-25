import { checkGroupsForReminder } from "~/services/check.server";

export async function loader() {
  try {
    await checkGroupsForReminder();
    return new Response("OK");
  } catch (error: unknown) {
    console.info("remindercheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
