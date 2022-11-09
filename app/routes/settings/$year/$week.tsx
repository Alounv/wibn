import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import { getUserAvailabilities } from "~/services/availabilities.server";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { Title } from "~/components/Title";
import invariant from "tiny-invariant";
import { getWeekLimits } from "~/utilities/dates.server";

const locale = "fr-FR";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.week, "week not found");
  invariant(params.year, "year not found");
  const week = Number(params.week);
  const year = Number(params.year);

  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const { start, end } = getWeekLimits({ week, year });

  const availabilities = await getUserAvailabilities({
    start,
    end,
    userId: user.id,
  });

  return json({
    availabilities,
    start: start.toLocaleDateString(locale),
    end: end.toLocaleDateString(locale),
  });
}

export default function GroupDetailsPage() {
  const { availabilities, start, end } = useLoaderData<typeof loader>();

  return (
    <div>
      <Title className="mb-4">Calendar based availabilities</Title>

      <div>
        Week: {start} -- {end}
      </div>

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
