import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { LinkButton } from "~/components/LinkButton";
import { WeekNavigation } from "~/components/PeriodsNavigation";
import { PeriodsSelection } from "~/components/PeriodsSelection";
import { getUserAvailabilities } from "~/services/availabilities.server";
import { requireUser } from "~/services/session.server";
import { getFormattedDate, getWeeksData } from "~/utilities/dates.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.groupId, "groupId not found");
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
    groupId: params.groupId,
  });
}

export default function GroupDetailsPage() {
  const {
    availabilities,
    start,
    end,
    previousWeek,
    nextWeek,
    currentWeek,
    groupId,
  } = useLoaderData<typeof loader>();

  const nextLink = `/settings/${nextWeek.year}/${nextWeek.week}`;
  const previousLink = `/settings/${previousWeek.year}/${previousWeek.week}`;
  const currentLink = `/settings/${currentWeek.year}/${currentWeek.week}`;

  return (
    <div className="flex flex-col items-start gap-8">
      <WeekNavigation
        nextLink={nextLink}
        previousLink={previousLink}
        currentLink={currentLink}
        start={start}
        end={end}
      >
        <PeriodsSelection periods={availabilities} isDisabled />
      </WeekNavigation>

      <LinkButton to={`/groups/${groupId}`}>Back to Group</LinkButton>
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
