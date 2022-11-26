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
    reminder: string | null;
  };
}

export default function GroupEdition({ errors, group }: IGroupEdition) {
  const {
    name,
    description,
    periods = [],
    users = [],
    admin,
    reminder,
  } = group || {};
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const emailsRef = useRef<HTMLTextAreaElement>(null);
  const adminEmailRef = useRef<HTMLSelectElement>(null);
  const reminderRef = useRef<HTMLInputElement>(null);

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
    } else if (errors?.reminder) {
      reminderRef.current?.focus();
    }
  }, [errors]);

  const reminderDate = reminder ? new Date(reminder) : null;
  const reminderDateValue = reminderDate?.toISOString().split("T")[0] || "";

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
      <LabelledInput
        type="date"
        label="Next reminder date"
        value={reminderDateValue}
        ref={reminderRef}
        name="reminder"
        error={errors?.reminder}
      />
      <PeriodsSelection
        periods={periods}
        areAllSelected={!group}
        variant="green"
      >
        Select possible times for the group to meet.
      </PeriodsSelection>
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
          <strong>
            ⚠️ It is highly recommended to use GMAIL addresses since this is the
            only supported calendar.
          </strong>
          <span>
            You can still add non GMAIL users but their calendar will be
            considered always available except from their fixed free periods.
          </span>

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
