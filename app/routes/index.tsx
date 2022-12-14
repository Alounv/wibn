import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-sky-500 mix-blend-multiply" />
            </div>
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-sky-200 drop-shadow-md">
                  Dispo
                </span>
              </h1>
              <p className="text-centeri mx-auto mt-6 max-w-lg text-xl text-white  sm:max-w-3xl">
                Dispo allows groups of friends or family to keep in touch based
                on their availability.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/groups"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-sky-700 shadow-sm hover:bg-sky-50 sm:px-8"
                  >
                    View groups for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Form
                      action="./google/auth"
                      method="post"
                      className="flex items-center justify-center"
                    >
                      <button className="w-full rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-sky-700 shadow-sm hover:bg-sky-50 sm:px-8">
                        Login with Google
                      </button>
                    </Form>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-600"
                    >
                      Login with Email
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
