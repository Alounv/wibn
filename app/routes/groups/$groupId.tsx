import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LinkButton } from "~/components/LinkButton";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { getGroup } from "~/models/group.server";
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

export default function GroupDetailsPage() {
  const {
    group: { name, description, periods, id },
  } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className="py-6">{description}</p>
      <PeriodsSelection key={id} isDisabled={true} periods={periods} />
      <hr className="my-4" />

      <div className="flex gap-2">
        <LinkButton to={`edit`}>Edit</LinkButton>
        <LinkButton variant="secondary" to={`delete`}>
          Delete
        </LinkButton>
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