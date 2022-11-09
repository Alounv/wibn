import { ReactNode } from "react";

export const Title = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h1 className={`text-3xl font-bold ${className}`}>{children}</h1>;
};
