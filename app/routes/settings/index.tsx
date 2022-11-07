import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
}

export default function GroupDetailsPage() {
  const { user } = useLoaderData<typeof loader>();

  return <div>{user.email}</div>;
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
