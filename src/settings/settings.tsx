import { BaseModal, ModalButton } from "../components/modal";
import { RadioButtonGroup } from "../components/radio-button-group";
import { ToggleButton } from "../components/toggle-button";
import { useDefaultLanguage } from "../providers/default-language-provider";
import { useQuerySetting } from "../providers/query-setting-provider";
import { useTheme } from "../providers/theme-provider";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const { theme, changeTheme, themes } = useTheme();

  const { language, changeLanguage, languages } = useDefaultLanguage();

  const { refetchInternal, updateRefreshInterval, showDevtools, toggleDevtools } =
    useQuerySetting();

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Settings">
      <RadioButtonGroup
        title="Theme"
        value={theme}
        onChange={changeTheme}
        values={themes}
        numberOfColumns={3}
      />
      <RadioButtonGroup
        title="Default Language"
        value={language}
        onChange={changeLanguage}
        values={languages}
        numberOfColumns={3}
        textTransform="uppercase"
      />

      <label className="mt-4 text-gray-900 dark:text-gray-100">
        Query Refresh Interval Seconds
      </label>
      <input
        onChange={(e) => updateRefreshInterval(parseInt(e.target.value ?? ""))}
        type="number"
        value={refetchInternal}
        className="block w-full rounded-md border-gray-300 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-slate-500 sm:text-sm"
        step={1}
        min={1}
      />

      <div className="mt-4">
        <label className="text-gray-900 dark:text-gray-100">Show Query DevTools</label>
        <ToggleButton
          checked={showDevtools}
          onChange={toggleDevtools}
          checkedLabel="On"
          uncheckedLabel="Off"
        />
      </div>
      <ModalButton label="Close" onClick={handleClose} />
    </BaseModal>
  );
}
