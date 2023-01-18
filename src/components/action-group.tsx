import type { PencilIcon } from "@heroicons/react/20/solid";
import type { PropsWithChildren } from "react";

export function ActionGroup({ children }: PropsWithChildren) {
  return <span className="isolate inline-flex rounded-md shadow-sm">{children}</span>;
}

export interface ActionButtonProps {
  Icon: typeof PencilIcon;
  label: string;
  position: "left" | "right" | "middle";
  onClick: () => void;
}

export function ActionButton({ Icon, label, position, onClick }: ActionButtonProps) {
  const roundedClass =
    position === "left" ? "rounded-l-md" : position === "right" ? "rounded-r-md" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${position === "left" ? "" : "-ml-px"
        } inline-flex items-center ${roundedClass} border border-gray-300 p-2 hover:bg-gray-50`}
    >
      <Icon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      {label}
    </button>
  );
}
