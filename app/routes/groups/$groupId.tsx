import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LinkButton } from "~/components/LinkButton";
import { Title } from "~/components/Title";
import { getGroup } from "~/models/group.server";
import { requireUser } from "~/services/session.server";
import { getFormattedDate } from "~/utilities/dates.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
  invariant(params.groupId, "groupId not found");

  const group = await getGroup({ userId: user.id, id: params.groupId });
  if (!group) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    group,
    isAdmin: user.id === group.admin.id,
    reminderDate: getFormattedDate(group.reminder),
  });
}

export default function GroupDetailsPage() {
  const {
    group: {
      name,
      description,
      users,
      admin,
      minParticipantsCount,
      periodicity,
    },
    reminderDate,
    isAdmin,
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-start gap-8">
      <Title>{name}</Title>
      <p>{description}</p>
      <Outlet />

      <div>
        <p>Members:</p>
        <ul>
          {users.map(({ id, email }) => (
            <li className="ml-2" key={id}>
              <span>👤 {email}</span>
              {admin.id === id && <strong> (admin)</strong>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <span>
          A reminder will be sent the week before the{" "}
          <strong>{reminderDate}</strong> if at least{" "}
          <strong>{minParticipantsCount} participants</strong> are available.{" "}
        </span>
        <span>
          If not, the group will try to send the reminder the following week,
          etc.
        </span>
        <span>
          In case of success, the next reminder will be set{" "}
          <strong>{periodicity} days</strong> later.
        </span>
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
