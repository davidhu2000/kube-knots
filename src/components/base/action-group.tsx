import { Menu, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  ArrowsUpDownIcon,
  PencilIcon,
  BarsArrowDownIcon,
  PlusIcon,
  PlayIcon,
  TrashIcon,
  CommandLineIcon,
  EllipsisVerticalIcon,
  StopCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { Fragment, type PropsWithChildren } from "react";

export type Actions =
  | "cordon"
  | "create"
  | "delete"
  | "edit"
  | "exec"
  | "logs"
  | "restart"
  | "scale"
  | "trigger"
  | "uncordon";

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
    case "create":
      return PlusIcon;
    case "trigger":
      return PlayIcon;
    case "delete":
      return TrashIcon;
    case "exec":
      return CommandLineIcon;
    case "cordon":
      return StopCircleIcon;
    case "uncordon":
      return PlayCircleIcon;
  }
};

export function ActionMenuWrapper({ children }: PropsWithChildren) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-black/30 dark:text-gray-100">
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-2 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-gray-200 shadow-lg focus:outline-none dark:divide-gray-700 dark:bg-gray-900">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

interface ActionMenuItemProps {
  label: Actions;
  onClick: () => void;
}
export function ActionMenuItem({ label, onClick }: ActionMenuItemProps) {
  const Icon = getIcon(label);

  return (
    <Menu.Item>
      <button
        className="group flex w-full items-center p-2 text-sm text-gray-700 hover:bg-gray-400 dark:text-gray-300 hover:dark:bg-gray-700"
        onClick={onClick}
      >
        <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
        <span className="capitalize">{label}</span>
      </button>
    </Menu.Item>
  );
}
