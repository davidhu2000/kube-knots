import { Switch } from "@headlessui/react";
import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import yaml from "js-yaml";
import { useEffect, useState } from "react";

import { useLanguage } from "../providers/language-provider";
import { useTheme } from "../providers/theme-provider";
import { Drawer } from "./drawer";

interface ResourceEditDrawerProps<T> {
  isOpen: boolean;
  selectedResource: T | null;
  handleClose: () => void;
}

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkedLabel: string;
  uncheckedLabel: string;
}
function ToggleButton({ checked, onChange, checkedLabel, uncheckedLabel }: ToggleButtonProps) {
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

export function ResourceEditDrawer<T extends { metadata?: V1ObjectMeta }>({
  isOpen,
  selectedResource,
  handleClose,
}: ResourceEditDrawerProps<T>) {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [code, setCode] = useState<string>(JSON.stringify(selectedResource, null, 4));
  const [showYaml, setShowYaml] = useState(language === "yaml");
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    if (showYaml) {
      setCode(yaml.dump(selectedResource));
    } else {
      setCode(JSON.stringify(selectedResource, null, 4));
    }
    setShowDiff(false);
  }, [selectedResource]);

  useEffect(() => {
    setShowYaml(language === "yaml");
  }, [language]);

  const handleShowYaml = (showYaml: boolean) => {
    if (showYaml) {
      const jsonObj = JSON.parse(code);
      const yamlStr = yaml.dump(jsonObj);
      setCode(yamlStr);
    } else {
      const jsonObj = yaml.load(code);
      const jsonStr = JSON.stringify(jsonObj, null, 4);
      setCode(jsonStr);
    }
    setShowYaml(showYaml);
  };

  const editorTheme = theme === "dark" ? "vs-dark" : "light";
  const editorLanguage = showYaml ? "yaml" : "json";

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedResource?.metadata?.name ?? ""}
      description={
        <div className="flex gap-8">
          <ToggleButton
            checked={showDiff}
            onChange={setShowDiff}
            checkedLabel="Hide Diff"
            uncheckedLabel="Show Diff"
          />
          <ToggleButton
            checked={showYaml}
            onChange={handleShowYaml}
            checkedLabel="Yaml"
            uncheckedLabel="JSON"
          />
        </div>
      }
    >
      {showDiff ? (
        <DiffEditor
          language={editorLanguage}
          original={
            showYaml ? yaml.dump(selectedResource) : JSON.stringify(selectedResource, null, 4)
          }
          theme={editorTheme}
          modified={code}
        />
      ) : (
        <Editor
          language={editorLanguage}
          value={code}
          theme={editorTheme}
          onChange={(code) => setCode(code ?? "")}
        />
      )}
    </Drawer>
  );
}
