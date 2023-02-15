import { Dialog } from "@headlessui/react";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  return (
    <Dialog as="div" className="relative z-10" onClose={handleClose} open={isOpen}>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative rounded-lg bg-gray-100 p-4 text-left shadow-xl">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              Settings
            </Dialog.Title>

            <div>TODO</div>

            <button
              className="mt-4 w-full rounded-md bg-gray-200 px-4 py-2 text-base text-gray-800 shadow-sm hover:bg-gray-300"
              onClick={handleClose}
            >
              Save
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
