import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import { getUserEvents } from "~/services/calendar.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const events = await getUserEvents({
    userId: user.id,
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  return json({ user, events });
}

export default function GroupDetailsPage() {
  const { user, events } = useLoaderData<typeof loader>();

  console.log(user);
  return <div>{JSON.stringify(events)}</div>;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>User not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
