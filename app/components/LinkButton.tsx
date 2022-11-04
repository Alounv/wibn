import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import { buttonClassNames, ButtonVariant } from "./Button";

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
