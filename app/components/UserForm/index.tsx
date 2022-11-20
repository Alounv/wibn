import { Form } from "@remix-run/react";
import type { User } from "~/models/user.server";
import type { Periods } from "~/utilities/periods";
import { Button } from "../Button";
import { PeriodsSelection } from "../PeriodsSelection";

interface IUserEdition {
  user: Pick<User, "id"> & {
    periods: Periods[];
  };
}

export default function UserEdition({ user }: IUserEdition) {
  const { periods = [] } = user;

  return (
    <Form method="patch" className="flex w-full flex-col gap-4">
      <PeriodsSelection periods={periods} variant="red">
        <span>
          Select times your are <strong>never</strong> available.
        </span>
      </PeriodsSelection>

      <input type="hidden" name="id" value={user.id} />

      <div className="text-left">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
