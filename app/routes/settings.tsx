import { useUser } from "~/utils";
import { GeneralLayout } from "~/components/GeneralLayout";
import { Link } from "@remix-run/react";

export default function GroupsPage() {
  const user = useUser();

  return (
    <GeneralLayout title="Settings" email={user.email}>
      <Link to="/groups" className="block p-4 text-xl text-blue-500">
        Go to groups
      </Link>
    </GeneralLayout>
  );
}
