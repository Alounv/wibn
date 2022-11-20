import { Link, NavLink } from "@remix-run/react";

export const GroupsNavbar = ({
  groups,
}: {
  groups: { id: string; name: string }[];
}) => {
  return (
    <>
      <Link to="../settings" className="block p-4 text-xl text-blue-500">
        ⚙️ settings
      </Link>
      <Link to="new" className="block p-4 text-xl text-blue-500">
        ➕ new group
      </Link>

      <hr />

      {groups.length === 0 ? (
        <p className="p-4">No group yet</p>
      ) : (
        <ol>
          {groups.map((group) => (
            <li key={group.id}>
              <NavLink
                className={({ isActive }) =>
                  `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                }
                to={group.id}
              >
                👥 {group.name}
              </NavLink>
            </li>
          ))}
        </ol>
      )}
    </>
  );
};
