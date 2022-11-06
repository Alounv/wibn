import { Link, Form, Outlet } from "@remix-run/react";

export const GeneralLayout = ({
  title,
  email,
  children,
}: {
  title: string;
  email: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">{title}</Link>
        </h1>
        <p>{email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">{children}</div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
