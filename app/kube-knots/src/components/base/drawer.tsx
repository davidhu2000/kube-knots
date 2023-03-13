import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, type ReactNode, type PropsWithChildren } from "react";

interface DrawerProps extends PropsWithChildren {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  description: ReactNode | string;
}

export function Drawer({ isOpen, handleClose, title, description, children }: DrawerProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        {isOpen && <div className="fixed inset-0 bg-black/30" aria-hidden="true" />}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen">
                  <div className="flex h-full flex-col overflow-y-scroll bg-gray-200 p-6 shadow-xl dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {title}
                      </Dialog.Title>

                      <Dialog.Description className="text-sm text-gray-500 dark:text-gray-300">
                        {description}
                      </Dialog.Description>

                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="relative h-full flex-1">
                      <div className="absolute inset-0 h-full">
                        <div className="h-full overflow-scroll shadow-xl" aria-hidden="true">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
