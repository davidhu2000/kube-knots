import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import yaml from "js-yaml";
import { useEffect, useState } from "react";

import { useCurrentContext } from "../providers/current-context-provider";
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

export function ResourceEditDrawer<T extends { kind?: string; metadata?: V1ObjectMeta }>({
  isOpen,
  selectedResource,
  handleClose,
}: ResourceEditDrawerProps<T>) {
  const { language } = useDefaultLanguage();
  const { theme, systemTheme } = useTheme();
  const { currentContext } = useCurrentContext();

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

  const updateMutation = useMutation({
    mutationFn: (resource: T) => {
      return invoke<boolean>(`update_${resource.kind.toLowerCase()}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        podName: resource.metadata?.name,
        pod: resource,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      // TODO: a better way to do this
      alert(`Updated ${variables.metadata?.name}`);
    },
    onError: (error) => {
      alert(error);
    },
  });

  const editorTheme = getEditorTheme(theme, systemTheme);

  const editorLanguage = showYaml ? "yaml" : "json";

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedResource?.metadata?.name ?? ""}
      description={
        <div className="flex w-full gap-8 p-2">
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

          <div className="flex-1 grow" />
          <button
            onClick={() => {
              const jsonObj = (showYaml ? yaml.load(code) : JSON.parse(code)) as T;
              updateMutation.mutate(jsonObj);
            }}
            className="rounded-md border bg-gray-100 px-4 py-2 text-gray-900 shadow-md dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
          >
            Save
          </button>
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
