import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import GroupForm from "~/components/GroupForm";
import { parseGroupFormData } from "~/components/GroupForm/parse";

import { getGroup, updateGroup } from "~/models/group.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.groupId, "groupId not found");

  const group = await getGroup({ userId, id: params.groupId });
  if (!group) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ group });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const id = formData.get("id");
  const periods = formData.getAll("periods");
  console.log({ periods });

  const { errors, data } = parseGroupFormData({
    name,
    description,
    id,
    periods,
  });
  if (errors || !data) {
    return json({ errors }, { status: 400 });
  }

  await updateGroup(data);

  return redirect(`/groups/${id}`);
}

export default function GroupDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return <GroupForm errors={actionData?.errors} group={data.group} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Group not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
