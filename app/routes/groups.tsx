import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getGroupListItems } from "~/models/group.server";
import { GeneralLayout } from "~/components/GeneralLayout";
import { GroupsNavbar } from "~/components/GroupsNavbar";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const groups = await getGroupListItems({ userId });
  return json({ groups });
}

export default function GroupsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <GeneralLayout title="Groups" email={user.email}>
      <GroupsNavbar groups={data.groups} />
    </GeneralLayout>
  );
}
