import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import { getUserAvailabilities } from "~/services/availabilities.server";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { Title } from "~/components/Title";
import invariant from "tiny-invariant";
import { getCurrentWeek, getWeekLimits } from "~/utilities/dates.server";

const locale = "fr-FR";
const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.week, "week not found");
  invariant(params.year, "year not found");
  const week = Number(params.week);
  const year = Number(params.year);

  const previousWeek =
    week === 1 ? { week: 52, year: year - 1 } : { week: week - 1, year };

  const nextWeek =
    week === 52 ? { week: 1, year: year + 1 } : { week: week + 1, year };

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
    start: start.toLocaleDateString(locale, format),
    end: end.toLocaleDateString(locale, format),
    previousWeek,
    nextWeek,
    currentWeek: getCurrentWeek(),
  });
}

export default function GroupDetailsPage() {
  const { availabilities, start, end, previousWeek, nextWeek, currentWeek } =
    useLoaderData<typeof loader>();

  const nextLink = `/settings/${nextWeek.year}/${nextWeek.week}`;
  const previousLink = `/settings/${previousWeek.year}/${previousWeek.week}`;
  const currentLink = `/settings/${currentWeek.year}/${currentWeek.week}`;

  return (
    <div className="flex flex-col items-start gap-4">
      <Title className="mb-4">Calendar based availabilities</Title>

      <Link to={currentLink}>📅 current week</Link>

      <div className="font-bold">
        <Link to={previousLink}>⬅️</Link>
        <span className="mx-2">
          {start} - {end}
        </span>
        <Link to={nextLink}>➡️</Link>
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
