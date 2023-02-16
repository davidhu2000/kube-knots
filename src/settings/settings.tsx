import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { BaseModal, ModalButton } from "../components/modal";
import { useTheme } from "../providers/theme-provider";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const { theme, changeTheme } = useTheme();

  const themes: (typeof theme | "system")[] = ["dark", "light", "system"];

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Settings">
      <div className="w-full px-4 py-16">
        <div className="mx-auto w-full max-w-md">
          <RadioGroup value={theme} onChange={changeTheme}>
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="space-y-2">
              {themes.map((theme) => (
                <RadioGroup.Option
                  key={theme}
                  value={theme}
                  className={({ active, checked }) =>
                    `${
                      active
                        ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                        : ""
                    }
                  ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}
                            >
                              {theme}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-white">
                            <CheckCircleIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <ModalButton label="Save" onClick={handleClose} />
    </BaseModal>
  );
}
