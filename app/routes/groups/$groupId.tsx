import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/Button";
import { LabelledInput } from "~/components/LabelledInput";

import { deleteGroup, getGroup } from "~/models/group.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.groupId, "groupId not found");

  const group = await getGroup({ userId, id: params.groupId });
  if (!group) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ group });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.groupId, "groupId not found");

  await deleteGroup({ userId, id: params.groupId });

  return redirect("/groups");
}

export default function GroupDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const [isOnEditMode, setIsOnEditMode] = useState(false);
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      {!isOnEditMode ? (
        <>
          <h3 className="text-2xl font-bold">{data.group.name}</h3>
          <p className="py-6">{data.group.description}</p>
          <hr className="my-4" />
        </>
      ) : (
        <Form method="patch">
          <LabelledInput
            label="Name"
            ref={nameRef}
            name="name"
            error={actionData?.errors?.name}
          />

          <LabelledInput
            rows={4}
            label="Description"
            ref={descriptionRef}
            name="description"
            error={actionData?.errors?.description}
          />

          <div className="text-right">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      )}

      <button
        className="rounded border-2 border-blue-500 py-2 px-4 text-blue-500 hover:bg-blue-100 focus:bg-blue-400"
        onClick={() => setIsOnEditMode(true)}
      >
        Edit
      </button>
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
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
    return <div>Group not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
