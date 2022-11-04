import type { Group } from "~/models/group.server";

export interface GroupErrors {
  name?: string;
  description?: string;
  id?: string;
}

type GroupFormData = Pick<Group, "name" | "id" | "description">;

const emptyGroupFormErrors: GroupErrors = {
  name: undefined,
  description: undefined,
  id: undefined,
};

type ParseGroupFormDataFn = (args: {
  name: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  id?: FormDataEntryValue | null;
  isIdRequired?: boolean;
}) => {
  errors?: GroupErrors;
  data?: GroupFormData;
};

export const parseGroupFormData: ParseGroupFormDataFn = ({
  name,
  description,
  id,
  isIdRequired = false,
}) => {
  let errors = emptyGroupFormErrors;

  if (typeof name !== "string" || name.length === 0) {
    errors.name = "Name is required";
    return { errors };
  }

  if (typeof description !== "string") {
    errors.description = "Description should be string";
    return { errors };
  }

  if (isIdRequired && !id) {
    errors.id = "Id should be defined";
    return { errors };
  }

  return { data: { name, description, id: (id as string) || "" } };
};
