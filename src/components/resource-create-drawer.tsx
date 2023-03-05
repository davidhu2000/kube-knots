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
import { SelectInput } from "./base/select-input";
import { Drawer } from "./drawer";
import { getEditorTheme } from "./resource-edit-drawer";
import { ToggleButton } from "./toggle-button";

interface ResourceCreateDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
}

type AvailableTemplates = "CronJobs" | "Deployment" | "Ingress" | "Service";

const templates: AvailableTemplates[] = ["CronJobs", "Deployment", "Ingress", "Service"];

export function ResourceCreateDrawer<T extends { kind?: string; metadata?: V1ObjectMeta }>({
  isOpen,
  handleClose,
}: ResourceCreateDrawerProps) {
  const { language } = useDefaultLanguage();
  const { theme, systemTheme } = useTheme();
  const { currentContext } = useCurrentContext();
  const [template, setTemplate] = useState<AvailableTemplates | null>(null);

  const [code, setCode] = useState<string>("");
  const [showYaml, setShowYaml] = useState(language === "yaml");

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
            onChange={(template) => setTemplate(template)}
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
            className="rounded-md border bg-gray-100 px-4 py-2 text-gray-900 shadow-md dark:border-gray-700 dark:bg-blue-800 dark:text-gray-100 hover:dark:bg-blue-900"
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
