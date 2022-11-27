import type { Group } from "~/models/group.server";

export interface GroupErrors {
  name?: string;
  description?: string;
  id?: string;
  periods?: string;
  emails?: string;
  adminEmail?: string;
  reminder?: string;
  minParticipantsCount?: string;
  periodicity?: string;
}

type GroupFormData = Pick<
  Group,
  "name" | "id" | "description" | "minParticipantsCount" | "periodicity"
> & {
  periods: string[];
  emails: string[];
  adminEmail: string | null;
  reminder: string | null;
};

const emptyGroupFormErrors: GroupErrors = {
  name: undefined,
  description: undefined,
  id: undefined,
  periods: undefined,
  emails: undefined,
  adminEmail: undefined,
  reminder: undefined,
  minParticipantsCount: undefined,
  periodicity: undefined,
};

type ParseGroupFormDataFn = (args: {
  name: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  periods: FormDataEntryValue[];
  id?: FormDataEntryValue | null;
  isIdRequired?: boolean;
  emailsString: FormDataEntryValue | null;
  adminEmail: FormDataEntryValue | null;
  reminder: FormDataEntryValue | null;
  minParticipantsCount: FormDataEntryValue | null;
  periodicity: FormDataEntryValue | null;
}) => {
  errors?: GroupErrors;
  data?: GroupFormData;
};

const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const parseGroupFormData: ParseGroupFormDataFn = ({
  name,
  description,
  periods,
  id,
  isIdRequired = false,
  emailsString,
  adminEmail,
  reminder,
  minParticipantsCount,
  periodicity,
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

  if (!!emailsString && typeof emailsString !== "string") {
    errors.emails = "Emails should be string";
    return { errors };
  }

  if (!!adminEmail && typeof adminEmail !== "string") {
    errors.adminEmail = "Admin email should be string";
    return { errors };
  }

  if (isIdRequired && !id) {
    errors.id = "Id should be defined";
    return { errors };
  }

  for (const period in periods) {
    if (typeof period !== "string") {
      errors.periods = "Periods should be string";
      return { errors };
    }
  }

  if (!!reminder && typeof reminder !== "string") {
    errors.adminEmail = "Next reminder should be string";
    return { errors };
  }

  const minParticipantsCountNumber = Number(minParticipantsCount);
  if (
    !!minParticipantsCount &&
    typeof minParticipantsCountNumber !== "number"
  ) {
    errors.minParticipantsCount = "Min participants count should be number";
    return { errors };
  }

  const periodicityNumber = Number(periodicity);
  if (!!periodicity && typeof periodicityNumber !== "number") {
    errors.periodicity = "Periodicity in days should be number";
    return { errors };
  }

  const emails = emailsString?.split("\n").map((email) => email.trim()) || [];

  const invalidEmails = emails.filter((e) => !e.match(emailRegex));
  if (invalidEmails.length) {
    errors.emails = `Invalid emails: ${invalidEmails.join(", ")}`;
    return { errors };
  }

  return {
    data: {
      name,
      description,
      periods: periods as string[],
      id: (id as string) || "",
      emails,
      adminEmail,
      reminder,
      minParticipantsCount: minParticipantsCountNumber,
      periodicity: periodicityNumber,
    },
  };
};
