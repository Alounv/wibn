import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

interface IWeekNavigation {
  previousLink: string;
  nextLink: string;
  currentLink: string;
  start: string;
  end: string;
  children: ReactNode;
}

export const WeekNavigation = ({
  previousLink,
  nextLink,
  currentLink,
  start,
  end,
  children,
}: IWeekNavigation) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="font-bold">
        <Link to={previousLink}>⬅️</Link>
        <span className="mx-2">
          {start} - {end}
        </span>
        <Link to={nextLink}>➡️</Link>
      </div>

      <Link to={currentLink}>📅 Current week</Link>
      {children}
    </div>
  );
};
