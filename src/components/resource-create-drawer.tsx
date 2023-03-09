import { type V1ObjectMeta } from "@kubernetes/client-node";
import Editor from "@monaco-editor/react";
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
import { getEditorTheme } from "./resource-edit-drawer";
import resourceTemplate from "./resource-templates.json";

interface ResourceCreateDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
}

type AvailableTemplates = keyof typeof resourceTemplate;

const templates = Object.keys(resourceTemplate) as AvailableTemplates[];

export function ResourceCreateDrawer<T extends { kind?: string; metadata?: V1ObjectMeta }>({
  isOpen,
  handleClose,
}: ResourceCreateDrawerProps) {
  const { language } = useDefaultLanguage();
  const { theme, systemTheme } = useTheme();
  const { currentContext } = useCurrentContext();
  const [template, setTemplate] = useState<AvailableTemplates | null>(null);

  const handleTemplateChange = (template: AvailableTemplates) => {
    setTemplate(template);

    const code = showYaml
      ? yaml.dump(resourceTemplate[template])
      : JSON.stringify(resourceTemplate[template], null, 4);

    setCode(code);
  };

  const [code, setCode] = useState<string>("");
  const [showYaml, setShowYaml] = useState(language === "yaml");

  useEffect(() => {
    setShowYaml(language === "yaml");
  }, [language]);

  useEffect(() => {
    setCode("");
    setTemplate(null);
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

  const createMutation = useMutation({
    mutationFn: (resource: T) => {
      const resourceKind = camelToSnakeCase(resource.kind);

      return invoke<boolean>(`create_${resourceKind}`, {
        context: currentContext,
        namespace: resource.metadata?.namespace,
        name: resource.metadata?.name,
        resource,
      });
    },
    onSuccess: (_data, variables) => {
      handleClose();
      toast.success(`Created ${variables.metadata?.name}`);
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
      title={"Create New Resource"}
      description={
        <div className="flex w-full gap-8 p-2">
          <SelectInput
            onChange={handleTemplateChange}
            value={template}
            options={templates}
            defaultLabel="Select Template"
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
              createMutation.mutate(jsonObj);
            }}
            className="rounded-md border bg-blue-200 px-4 py-2 text-gray-900 shadow-md hover:bg-blue-300 dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
          >
            Save
          </button>
        </div>
      }
    >
      <Editor
        language={editorLanguage}
        value={code}
        theme={editorTheme}
        onChange={(code) => setCode(code ?? "")}
      />
    </Drawer>
  );
}
