import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { Group } from "~/models/group.server";
import type { Periods } from "~/utilities/periods";
import { Button } from "../Button";
import { LabelledInput } from "../LabelledInput";
import { PeriodsSelection } from "../PeriodsSelection";
import type { GroupErrors } from "./parse";

interface IGroupEdition {
  errors?: GroupErrors;
  group?: Pick<Group, "name" | "description" | "id"> & {
    periods: Periods[];
  };
}

export default function GroupEdition({ errors, group }: IGroupEdition) {
  const { name, description, periods = [] } = group || {};
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.description) {
      descriptionRef.current?.focus();
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

      <div className="text-right">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
