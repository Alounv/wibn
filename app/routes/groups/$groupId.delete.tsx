import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { LinkButton } from "~/components/LinkButton";
import { Title } from "~/components/Title";

import { deleteGroup, getAdministeredGroup } from "~/models/group.server";
import { requireUser } from "~/services/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
  invariant(params.groupId, "groupId not found");

  const group = await getAdministeredGroup({
    adminId: user.id,
    id: params.groupId,
  });
  if (!group) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ group });
}

export async function action({ request, params }: ActionArgs) {
  const user = await requireUser(request);
  invariant(params.groupId, "groupId not found");

  await deleteGroup({ adminId: user.id, id: params.groupId });

  return redirect("/groups");
}

export default function GroupDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <Title>Delete group {data.group.name}?</Title>
      <p className="py-6 font-bold">This action cannot be reverse.</p>

      <div className="flex gap-2">
        <LinkButton variant="secondary" to={`../${data.group.id}`}>
          Cancel
        </LinkButton>
        <Form method="post">
          <Button variant="danger" type="submit">
            Delete
          </Button>
        </Form>
      </div>
    </div>
  );
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
