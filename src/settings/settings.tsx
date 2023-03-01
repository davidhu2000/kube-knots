import { BaseModal, ModalButton } from "../components/modal";
import { RadioButtonGroup } from "../components/radio-button-group";
import { useDefaultLanguage } from "../providers/default-language-provider";
import { useTheme } from "../providers/theme-provider";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const { theme, changeTheme, themes } = useTheme();

  const { language, changeLanguage, languages } = useDefaultLanguage();

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

      <ModalButton label="Close" onClick={handleClose} />
    </BaseModal>
  );
}
