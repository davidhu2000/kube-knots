import { BaseModal, ModalButton } from "../components/modal";

export function Settings({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  return (
    <BaseModal isOpen={isOpen} handleClose={handleClose} title="Settings">
      <div>TODO</div>

      <ModalButton label="Save" onClick={handleClose} />
    </BaseModal>
  );
}
