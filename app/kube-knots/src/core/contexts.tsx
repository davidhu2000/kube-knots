import { BaseModal, ModalButton } from "../components/base/modal";
import { RadioButtonGroup } from "../components/base/radio-button-group";
import { useCurrentContext } from "../providers/current-context-provider";

export function Context() {
  const { currentContext } = useCurrentContext();

  return (
    <div className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
      {currentContext}
    </div>
  );
}

export function ContextSwitcher({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) {
  const { currentContext, changeCurrentContext, availableContexts } = useCurrentContext();

  const handleChange = (context: string) => {
    changeCurrentContext(context);
    handleClose();
  };

  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Contexts">
      <RadioButtonGroup
        title=""
        value={currentContext ?? ""}
        onChange={handleChange}
        values={availableContexts.map((c) => c.name)}
        numberOfColumns={1}
        textTransform="normal-case"
      />

      <ModalButton label="Close" onClick={handleClose} />
    </BaseModal>
  );
}
