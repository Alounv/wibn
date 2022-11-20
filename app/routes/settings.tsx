import { GeneralLayout } from "~/components/GeneralLayout";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { requireUser } from "~/services/session.server";
import UserEdition from "~/components/UserForm";
import { parseUserFormData } from "~/components/UserForm/parse";
import { getUserWithPeriods, updateUser } from "~/models/user.server";
import invariant from "tiny-invariant";
import type { Periods } from "~/utilities/periods";
import { Title } from "~/components/Title";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const userWithPeriods = await getUserWithPeriods(user.id);
  invariant(userWithPeriods, "User should be defined");

  return json({
    userWithPeriods: {
      ...user,
      periods: userWithPeriods.periods,
    },
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");
  const periods = formData.getAll("periods");

  const { errors, data } = parseUserFormData({ id, periods });
  if (errors || !data) {
    return json({ errors }, { status: 400 });
  }

  await updateUser(data);

  return redirect(`settings`);
}

export default function UserPage() {
  const { userWithPeriods } = useLoaderData<typeof loader>();
  const { periods, ...user } = userWithPeriods;

  return (
    <GeneralLayout
      title="User settings"
      email={user.email}
      color="bg-sky-800"
      sidebar={
        <Link to="/groups" className="block p-4 text-xl text-blue-500">
          Go to groups
        </Link>
      }
    >
      <div className="flex flex-col gap-8">
        <Title>User settings</Title>
        <UserEdition user={{ ...user, periods: periods as Periods[] }} />
        <Outlet />
      </div>
    </GeneralLayout>
  );
}
