import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import { getUserAvailabilities } from "~/services/availabilities.server";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { Title } from "~/components/Title";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const availabilities = await getUserAvailabilities({
    date: new Date(),
    userId: user.id,
  });
  return json({ availabilities });
}

export default function GroupDetailsPage() {
  const { availabilities } = useLoaderData<typeof loader>();

  return (
    <div>
      <Title className="mb-4">Calendar based availabilities</Title>

      <PeriodsSelection periods={availabilities} isDisabled />
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
    return <div>User not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
