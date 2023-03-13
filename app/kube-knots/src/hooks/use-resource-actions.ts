import { useState } from "react";

export function useResourceActions<ResourceName, Actions>() {
  const [action, setAction] = useState<Actions | null>(null);
  const [selected, setSelected] = useState<ResourceName | null>(null);

  const handleOpen = (resource: ResourceName, action: Actions) => {
    setSelected(resource);
    setAction(action);
  };

  const handleClose = () => {
    setSelected(null);
    setAction(null);
  };

  return {
    action,
    selected,
    handleOpen,
    handleClose,
  };
}
