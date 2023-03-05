import { Switch } from "@headlessui/react";

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedLabel: string;
  uncheckedLabel: string;
}
export function ToggleButton({
  checked,
  onChange,
  checkedLabel,
  uncheckedLabel,
}: ToggleButtonProps) {
  const label = checked ? checkedLabel : uncheckedLabel;
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? "bg-blue-600 dark:bg-blue-300" : "bg-gray-200 dark:bg-gray-500"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${
            checked ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 rounded-full bg-white transition`}
        />
      </Switch>
      <Switch.Label as="span" className="ml-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
      </Switch.Label>
    </Switch.Group>
  );
}
