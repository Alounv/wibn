import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import { getUserAvailabilities } from "~/services/availabilities.server";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { getFormattedDate, getWeeksData } from "~/utilities/dates.server";
import { WeekNavigation } from "~/components/PeriodsNavigation";

export async function loader({ request, params }: LoaderArgs) {
  const { start, end, previousWeek, nextWeek, currentWeek } = getWeeksData({
    year: params.year,
    week: params.week,
  });

  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const availabilities = await getUserAvailabilities({
    start,
    end,
    userId: user.id,
  });

  return json({
    availabilities,
    start: getFormattedDate(start),
    end: getFormattedDate(end),
    previousWeek,
    nextWeek,
    currentWeek,
  });
}

export default function SettingsAvailabilities() {
  const { availabilities, start, end, previousWeek, nextWeek, currentWeek } =
    useLoaderData<typeof loader>();

  const nextLink = `./../../${nextWeek.year}/${nextWeek.week}`;
  const previousLink = `./../../${previousWeek.year}/${previousWeek.week}`;
  const currentLink = `./../../${currentWeek.year}/${currentWeek.week}`;

  return (
    <WeekNavigation
      nextLink={nextLink}
      previousLink={previousLink}
      currentLink={currentLink}
      start={start}
      end={end}
    >
      <PeriodsSelection periods={availabilities} isDisabled />
    </WeekNavigation>
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
