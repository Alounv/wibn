import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { Group } from "~/models/group.server";
import type { User } from "~/models/user.server";
import type { Periods } from "~/utilities/periods";
import { Button } from "../Button";
import { LabelledInput } from "../LabelledInput";
import { LabelledSelect } from "../LabelledSelect";
import { PeriodsSelection } from "../PeriodsSelection";
import type { GroupErrors } from "./parse";

interface IGroupEdition {
  errors?: GroupErrors;
  group?: Pick<Group, "name" | "description" | "id"> & {
    periods: Periods[];
    users: Pick<User, "id" | "email">[];
    admin: Pick<User, "email">;
  };
}

export default function GroupEdition({ errors, group }: IGroupEdition) {
  const { name, description, periods = [], users = [], admin } = group || {};
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const emailsRef = useRef<HTMLTextAreaElement>(null);
  const adminEmailRef = useRef<HTMLSelectElement>(null);

  const emails = users?.map((u) => u.email).join("\n") || "";

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.description) {
      descriptionRef.current?.focus();
    } else if (errors?.emails) {
      emailsRef.current?.focus();
    } else if (errors?.adminEmail) {
      adminEmailRef.current?.focus();
    }
  }, [errors]);

  return (
    <Form
      method={group ? "patch" : "post"}
      className="flex w-full flex-col gap-2"
    >
      <LabelledInput
        label="Name"
        ref={nameRef}
        value={name}
        name="name"
        error={errors?.name}
      />

      <LabelledInput
        rows={4}
        label="Description"
        value={description}
        ref={descriptionRef}
        name="description"
        error={errors?.description}
      />

      <PeriodsSelection
        periods={periods}
        areAllSelected={!group}
        legend="Select possible periods for the group to meet."
      />

      <input type="hidden" name="id" value={group?.id} />

      {group && (
        <>
          <LabelledInput
            rows={4}
            label="Members"
            value={emails}
            ref={emailsRef}
            name="emails"
            error={errors?.emails}
          />

          <LabelledSelect
            label="Admin"
            value={admin?.email}
            ref={adminEmailRef}
            name="admin"
            error={""}
            options={users.map((u) => ({
              value: u.email,
              label: u.email,
            }))}
          />
        </>
      )}

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
