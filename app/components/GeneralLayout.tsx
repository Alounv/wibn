import { Link, Form } from "@remix-run/react";
import type { ReactNode } from "react";

export const GeneralLayout = ({
  title,
  email,
  sidebar,
  children,
  color = "bg-slate-800",
}: {
  title: string;
  email: string;
  color?: string;
  sidebar?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header
        className={`flex items-center justify-between ${color} p-4 text-white`}
      >
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
        <div className="h-full w-80 border-r bg-gray-50">{sidebar}</div>

        <div className="max-w-lg flex-1 p-6">{children}</div>
      </main>
    </div>
  );
};
