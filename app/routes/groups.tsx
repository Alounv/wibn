import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUser } from "~/services/session.server";
import { listUserGroups } from "~/models/group.server";
import { GeneralLayout } from "~/components/GeneralLayout";
import { GroupsNavbar } from "~/components/GroupsNavbar";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const groups = await listUserGroups({ userId: user.id });
  return json({ groups, user });
}

export default function GroupsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <GeneralLayout
      title="👥 Groups"
      color="bg-sky-800"
      email={data.user.email}
      sidebar={<GroupsNavbar groups={data.groups} />}
    >
      <Outlet />
    </GeneralLayout>
  );
}
