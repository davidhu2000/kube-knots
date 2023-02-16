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
  position: "left" | "right" | "middle" | "single";
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

const getRoundedClass = (position: ActionButtonProps["position"]) => {
  switch (position) {
    case "left":
      return "rounded-l-md";
    case "right":
      return "rounded-r-md";
    case "middle":
      return "";
    case "single":
      return "rounded-md";
  }
};

export function ActionButton({ label, position, onClick }: ActionButtonProps) {
  const Icon = getIcon(label);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${
        position === "left" ? "" : "-ml-px"
      } inline-flex items-center ${getRoundedClass(
        position
      )} border border-gray-300 p-2 hover:bg-gray-50 dark:border-gray-600 hover:dark:bg-gray-700`}
    >
      <Icon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      {label[0].toUpperCase()}
      {label.slice(1)}
    </button>
  );
}
