import { SelectInput } from "../components/base/select-input";
import { useNamespace } from "../providers/namespaces-provider";

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
