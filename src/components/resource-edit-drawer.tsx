import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import yaml from "js-yaml";
import { useEffect, useState } from "react";

import { useDefaultLanguage } from "../providers/default-language-provider";
import { useTheme } from "../providers/theme-provider";
import { Drawer } from "./drawer";
import { ToggleButton } from "./toggle-button";

interface ResourceEditDrawerProps<T> {
  isOpen: boolean;
  selectedResource: T | null;
  handleClose: () => void;
}

function getEditorTheme(
  theme: ReturnType<typeof useTheme>["theme"],
  systemTheme: ReturnType<typeof useTheme>["systemTheme"]
) {
  if (theme === "system") {
    return systemTheme === "dark" ? "vs-dark" : "light";
  }

  return theme === "dark" ? "vs-dark" : "light";
}

export function ResourceEditDrawer<T extends { metadata?: V1ObjectMeta }>({
  isOpen,
  selectedResource,
  handleClose,
}: ResourceEditDrawerProps<T>) {
  const { language } = useDefaultLanguage();
  const { theme, systemTheme } = useTheme();

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

  const editorTheme = getEditorTheme(theme, systemTheme);

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
