import {
  ArrowPathIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/20/solid";
import type { PropsWithChildren } from "react";

export function ActionGroup({ children }: PropsWithChildren) {
  return <span className="isolate inline-flex rounded-md shadow-sm">{children}</span>;
}

export type Actions = "logs" | "edit" | "scale" | "restart";

interface ActionButtonProps {
  label: Actions;
  position: "left" | "right" | "middle";
  onClick: () => void;
}

const getIcon = (label: Actions) => {
  switch (label) {
    case "logs":
      return BarsArrowDownIcon;
    case "edit":
      return PencilIcon;
    case "scale":
      return ArrowsUpDownIcon;
    case "restart":
      return ArrowPathIcon;
  }
};

// TODO: handle situation where there is only one button
export function ActionButton({ label, position, onClick }: ActionButtonProps) {
  const roundedClass =
    position === "left" ? "rounded-l-md" : position === "right" ? "rounded-r-md" : "";

  const Icon = getIcon(label);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${
        position === "left" ? "" : "-ml-px"
      } inline-flex items-center ${roundedClass} border border-gray-300 p-2 hover:bg-gray-50 hover:dark:bg-gray-700`}
    >
      <Icon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      {label[0].toUpperCase()}
      {label.slice(1)}
    </button>
  );
}
