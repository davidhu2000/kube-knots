import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import yaml from "js-yaml";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { camelToSnakeCase } from "../helpers/casing-helpers";
import { useCurrentContext } from "../providers/current-context-provider";
import { useDefaultLanguage } from "../providers/default-language-provider";
import { useTheme } from "../providers/theme-provider";
import { Drawer } from "./base/drawer";
import { SelectInput } from "./base/select-input";
import { ToggleButton } from "./base/toggle-button";
import resourceTemplate from "./resource-templates.json";

type AvailableTemplates = keyof typeof resourceTemplate;

const templates = Object.keys(resourceTemplate) as AvailableTemplates[];

interface ResourceCreateEditDrawerProps<T> {
  isOpen: boolean;
  selectedResource: T | null;
  handleClose: () => void;
  action: "create" | "update";
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

export function ResourceCreateEditDrawer<T extends { kind?: string; metadata?: V1ObjectMeta }>({
  isOpen,
  selectedResource,
  handleClose,
  action,
}: ResourceCreateEditDrawerProps<T>) {
  const { language } = useDefaultLanguage();
  const { theme, systemTheme } = useTheme();
  const { currentContext } = useCurrentContext();

  const [code, setCode] = useState<string>(JSON.stringify(selectedResource, null, 4));
  const [showYaml, setShowYaml] = useState(language === "yaml");
  const [showDiff, setShowDiff] = useState(false);

  const [template, setTemplate] = useState<AvailableTemplates | null>(null);
  const handleTemplateChange = (template: AvailableTemplates) => {
    setTemplate(template);

    const code = showYaml
      ? yaml.dump(resourceTemplate[template])
      : JSON.stringify(resourceTemplate[template], null, 4);

    setCode(code);
  };

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

  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setTemplate(null);
    }
  }, [isOpen]);

  const handleShowYaml = (showYaml: boolean) => {
    setShowYaml(showYaml);

    if (!code) {
      return;
    }

    if (showYaml) {
      const jsonObj = JSON.parse(code);
      const yamlStr = yaml.dump(jsonObj);
      setCode(yamlStr);
    } else {
      const jsonObj = yaml.load(code);
      const jsonStr = JSON.stringify(jsonObj, null, 4);
      setCode(jsonStr);
    }
  };

  const resourceMutation = useMutation({
    mutationFn: (resource: T) => {
      const resourceKind = camelToSnakeCase(resource.kind);

      return invoke<boolean>(`${action}_${resourceKind}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
        resource,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      toast.success(`${action} ${variables.metadata?.name}`);
    },
    onError: (error) => {
      toast.error(error as string);
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
          {action === "update" && (
            <ToggleButton
              checked={showDiff}
              onChange={setShowDiff}
              checkedLabel="Hide Diff"
              uncheckedLabel="Show Diff"
            />
          )}
          {action === "create" && (
            <SelectInput
              onChange={handleTemplateChange}
              value={template}
              options={templates}
              defaultLabel="Select Template"
            />
          )}
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
              resourceMutation.mutate(jsonObj);
            }}
            className="rounded-md border bg-blue-200 px-4 py-2 text-gray-900 shadow-md hover:bg-blue-300 dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
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
          options={{ tabSize: 2 }}
        />
      )}
    </Drawer>
  );
}
