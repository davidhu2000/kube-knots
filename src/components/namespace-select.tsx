import { useNamespace } from "../providers/namespaces-provider";
import { SelectInput } from "./base/select-input";

export function NamespaceSelect() {
  const { currentNamespace, availableNamespaces, changeNamespace } = useNamespace();

  return (
    <SelectInput
      onChange={changeNamespace}
      value={currentNamespace}
      options={availableNamespaces}
      defaultLabel="All Namespaces"
    />
  );
}
