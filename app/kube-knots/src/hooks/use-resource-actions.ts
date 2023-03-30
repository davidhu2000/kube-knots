import { useCallback, useState } from "react";

export function useResourceActions<ResourceName, Actions>() {
  const [action, setAction] = useState<Actions | null>(null);
  const [selected, setSelected] = useState<ResourceName | null>(null);

  const handleOpen = useCallback((resource: ResourceName, action: Actions) => {
    setSelected(resource);
    setAction(action);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setAction(null);
  }, []);

  return {
    action,
    selected,
    handleOpen,
    handleClose,
  };
}
