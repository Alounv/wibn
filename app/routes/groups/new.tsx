import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import GroupForm from "~/components/GroupForm";
import { parseGroupFormData } from "~/components/GroupForm/parse";

import { createGroup } from "~/models/group.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const periods = formData.getAll("periods");

  const { errors, data } = parseGroupFormData({ name, description, periods });
  if (errors || !data) {
    return json({ errors }, { status: 400 });
  }

  const group = await createGroup({ ...data, userId });

  return redirect(`/groups/${group.id}`);
}

export default function NewGroupPage() {
  const actionData = useActionData<typeof action>();
  return <GroupForm errors={actionData?.errors} />;
}
