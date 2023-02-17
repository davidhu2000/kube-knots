import { Dialog } from "@headlessui/react";
import { type PropsWithChildren } from "react";

interface BaseModalProps extends PropsWithChildren {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
}
export function BaseModal({ isOpen, handleClose, children, title }: BaseModalProps): JSX.Element {
  return (
    <Dialog as="div" className="relative z-10" onClose={handleClose} open={isOpen}>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-700/75" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative rounded-lg bg-gray-100 p-4 text-left shadow-xl dark:bg-gray-900">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              {title}
            </Dialog.Title>

            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

interface ModalButtonProps {
  label: string;
  onClick: () => void;
}
export function ModalButton({ label, onClick }: ModalButtonProps): JSX.Element {
  return (
    <button
      className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 text-base text-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
