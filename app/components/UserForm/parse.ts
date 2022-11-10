import type { User } from "~/models/user.server";

export interface UserErrors {
  periods?: string;
  id?: string;
}

type UserFormData = Pick<User, "id"> & {
  periods: string[];
};

const emptyUserFormErrors: UserErrors = {
  periods: undefined,
  id: undefined,
};

type ParseUserFormDataFn = (args: {
  id: FormDataEntryValue | null;
  periods: FormDataEntryValue[];
}) => {
  errors?: UserErrors;
  data?: UserFormData;
};

export const parseUserFormData: ParseUserFormDataFn = ({ id, periods }) => {
  let errors = emptyUserFormErrors;

  for (const period in periods) {
    if (typeof period !== "string") {
      errors.periods = "Periods should be string";
      return { errors };
    }
  }

  if (!id) {
    errors.id = "Id should be defined";
    return { errors };
  }

  return {
    data: {
      id: (id as string) || "",
      periods: periods as string[],
    },
  };
};
