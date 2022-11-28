import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Availabilities } from "~/components/Availabilities";
import { DisconnectedWarning } from "~/components/DisconnectedWarning";
import { WeekNavigation } from "~/components/PeriodsNavigation";
import { getGroupAvailabilities } from "~/models/group.server";
import { requireUser } from "~/services/session.server";
import { getFormattedDate, getWeeksData } from "~/utilities/dates.server";

export async function loader({ request, params }: LoaderArgs) {
  const { groupId } = params;
  invariant(groupId, "groupId not found");
  const { start, end, previousWeek, nextWeek, currentWeek } = getWeeksData({
    year: params.year,
    week: params.week,
  });

  const user = await requireUser(request);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const { availabilities, possibilities, disconnectedUsers } =
    await getGroupAvailabilities({
      start,
      end,
      groupId,
    });

  return json({
    availabilities,
    possibilities,
    disconnectedUsers,
    start: getFormattedDate(start),
    end: getFormattedDate(new Date(end.getTime() - 1)),
    previousWeek,
    nextWeek,
    currentWeek,
    groupId,
  });
}

export default function GroupDetailsPage() {
  const {
    availabilities,
    possibilities,
    start,
    end,
    previousWeek,
    nextWeek,
    currentWeek,
    disconnectedUsers,
  } = useLoaderData<typeof loader>();

  const nextLink = `./../../${nextWeek.year}/${nextWeek.week}`;
  const previousLink = `./../../${previousWeek.year}/${previousWeek.week}`;
  const currentLink = `./../../${currentWeek.year}/${currentWeek.week}`;

  const hasDisconnectedUsers = disconnectedUsers.length > 0;
  const [areDisconnectedVisible, setAreDisconnectedVisible] = useState(false);

  return (
    <>
      {hasDisconnectedUsers && (
        <>
          <DisconnectedWarning
            emails={disconnectedUsers.map((u) => u.email)}
            areDisconnectedVisible={areDisconnectedVisible}
            setAreDisconnectedVisible={setAreDisconnectedVisible}
          />
        </>
      )}

      <WeekNavigation
        nextLink={nextLink}
        previousLink={previousLink}
        currentLink={currentLink}
        start={start}
        end={end}
      >
        <Availabilities
          areDisconnectedVisible={areDisconnectedVisible}
          availabilities={availabilities}
          possibilities={possibilities}
        />
      </WeekNavigation>
    </>
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
