export const buttonClassNames = {
  primary:
    "rounded border-2 border-sky-500 bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400",
  secondary:
    "rounded border-2 border-sky-500 py-2 px-4 text-sky-500 hover:bg-sky-100 focus:bg-sky-400",
  danger:
    "rounded border-2 border-red-500 bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400",
};

export type ButtonVariant = keyof typeof buttonClassNames;

interface IButton {
  variant?: ButtonVariant;
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  type,
  onClick,
}: IButton) => {
  return (
    <button type={type} className={buttonClassNames[variant]} onClick={onClick}>
      {children}
    </button>
  );
};
