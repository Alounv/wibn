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
      <PeriodsSelection
        periods={periods}
        legend="Select periods where you are never available."
        variant="red"
      />

      <input type="hidden" name="id" value={user.id} />

      <div className="text-left">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
