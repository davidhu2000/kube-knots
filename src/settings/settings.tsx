import { RadioGroup } from "@headlessui/react";

import { BaseModal, ModalButton } from "../components/modal";
import { useTheme } from "../providers/theme-provider";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const { theme, changeTheme } = useTheme();

  const themes: (typeof theme | "system")[] = ["dark", "light", "system"];

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Settings">
      <RadioGroup value={theme} onChange={changeTheme} className="p-4">
        <RadioGroup.Label className="text-gray-900 dark:text-gray-100">Theme</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <RadioGroup.Option
              key={theme}
              value={theme}
              className={({ checked }) =>
                `${
                  checked ? "bg-gray-800 text-white" : "bg-white"
                } flex cursor-pointer rounded-lg p-4 shadow-md w-32 h-12`
              }
            >
              {({ checked }) => (
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
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      {/* <ModalButton label="Save" onClick={handleClose} /> */}
    </BaseModal>
  );
}
