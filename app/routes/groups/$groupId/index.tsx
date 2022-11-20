import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LinkButton } from "~/components/LinkButton";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { Title } from "~/components/Title";
import { getGroup } from "~/models/group.server";
import { requireUser } from "~/services/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
  invariant(params.groupId, "groupId not found");

  const group = await getGroup({ userId: user.id, id: params.groupId });
  if (!group) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ group, isAdmin: user.id === group.admin.id });
}

export default function GroupDetailsPage() {
  const {
    group: { name, description, periods, id, users, admin },
    isAdmin,
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-start gap-8">
      <Title>{name}</Title>
      <p>{description}</p>
      <PeriodsSelection key={id} isDisabled periods={periods} />

      <LinkButton to={`current`}>See availabilities</LinkButton>

      <div>
        <p>Users:</p>
        <ul>
          {users.map(({ id, email }) => (
            <li className="ml-2" key={id}>
              <span>👤 {email}</span>
              {admin.id === id && <strong> (admin)</strong>}
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <LinkButton to={`edit`}>Edit</LinkButton>
          <LinkButton variant="secondary" to={`delete`}>
            Delete
          </LinkButton>
        </div>
      )}
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
