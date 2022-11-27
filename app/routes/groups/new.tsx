import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import GroupForm from "~/components/GroupForm";
import { parseGroupFormData } from "~/components/GroupForm/parse";

import { createGroup } from "~/models/group.server";
import { requireUser } from "~/services/session.server";

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const periods = formData.getAll("periods");
  const reminder = formData.get("reminder");
  const periodicity = formData.get("periodicity");
  const minParticipantsCount = formData.get("minParticipantsCount");

  const { errors, data } = parseGroupFormData({
    name,
    description,
    periods,
    adminEmail: null,
    emailsString: null,
    reminder,
    periodicity,
    minParticipantsCount,
  });
  if (errors || !data) {
    return json({ errors }, { status: 400 });
  }

  const group = await createGroup({ ...data, adminId: user.id });

  return redirect(`/groups/${group.id}`);
}

export default function NewGroupPage() {
  const actionData = useActionData<typeof action>();
  return <GroupForm errors={actionData?.errors} />;
}
