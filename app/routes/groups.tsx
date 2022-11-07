import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUser } from "~/session.server";
import { getGroupListItems } from "~/models/group.server";
import { GeneralLayout } from "~/components/GeneralLayout";
import { GroupsNavbar } from "~/components/GroupsNavbar";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const groups = await getGroupListItems({ userId: user.id });
  return json({ groups, user });
}

export default function GroupsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <GeneralLayout title="Groups" email={data.user.email}>
      <GroupsNavbar groups={data.groups} />
    </GeneralLayout>
  );
}
