import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { LinkButton } from "~/components/LinkButton";

import { deleteGroup, getGroup } from "~/models/group.server";
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

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.groupId, "groupId not found");

  await deleteGroup({ userId, id: params.groupId });

  return redirect("/groups");
}

export default function GroupDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">Delete group {data.group.name}?</h3>
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
