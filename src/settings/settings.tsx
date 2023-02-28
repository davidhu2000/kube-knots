import { RadioGroup } from "@headlessui/react";

import { BaseModal, ModalButton } from "../components/modal";
import { ContextSelect } from "../core/contexts";
import { useDefaultLanguage } from "../providers/default-language-provider";
import { useTheme } from "../providers/theme-provider";

interface RadioButtonGroupProp<T> {
  title: string;
  value: T;
  onChange: (value: T) => void;
  values: T[];
}

function RadioButtonGroup<T extends string>({
  value,
  onChange,
  values,
  title,
}: RadioButtonGroupProp<T>) {
  return (
    <RadioGroup value={value} onChange={onChange} className="py-4">
      <RadioGroup.Label className="text-gray-900 dark:text-gray-100">{title}</RadioGroup.Label>
      <div className="grid grid-cols-3 gap-2">
        {values.map((value) => (
          <RadioGroup.Option
            key={value}
            value={value}
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
                      {value}
                    </RadioGroup.Label>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const { theme, changeTheme, themes } = useTheme();

  const { language, changeLanguage, languages } = useDefaultLanguage();

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Settings">
      <RadioButtonGroup title="Theme" value={theme} onChange={changeTheme} values={themes} />
      <RadioButtonGroup
        title="Default Language"
        value={language}
        onChange={changeLanguage}
        values={languages}
      />

      <div className="py-4">
        <div className="text-gray-900 dark:text-gray-100">Switch Context</div>
        <ContextSelect />
      </div>

      <ModalButton label="Close" onClick={handleClose} />
    </BaseModal>
  );
}
