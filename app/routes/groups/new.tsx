import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { Button } from "~/components/Button";
import { LabelledInput } from "~/components/LabelledInput";

import { createGroup } from "~/models/group.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Name is required", description: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string") {
    return json(
      { errors: { name: null, description: "Description should be a string" } },
      { status: 400 }
    );
  }

  const group = await createGroup({ name, description, userId });

  return redirect(`/groups/${group.id}`);
}

export default function NewGroupPage() {
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
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
  );
}
