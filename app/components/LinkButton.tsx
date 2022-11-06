import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import type { ButtonVariant } from "./Button";
import { buttonClassNames } from "./Button";

interface ILinkButton {
  to: string;
  children: ReactNode;
  variant?: ButtonVariant;
}

export const LinkButton = ({
  to,
  children,
  variant = "primary",
}: ILinkButton) => {
  return (
    <Link to={to} className={buttonClassNames[variant]}>
      {children}
    </Link>
  );
};
