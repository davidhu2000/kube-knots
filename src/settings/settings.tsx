import { BaseModal, ModalButton } from "../components/modal";
import { RadioButtonGroup } from "../components/radio-button-group";
import { useDefaultLanguage } from "../providers/default-language-provider";
import { useTheme } from "../providers/theme-provider";

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

      <ModalButton label="Close" onClick={handleClose} />
    </BaseModal>
  );
}
