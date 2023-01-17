import { Switch } from "@headlessui/react";
import { type V1Pod } from "@kubernetes/client-node";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

import { Drawer } from "../components/drawer";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export default function PodEdit({ isOpen, selectedPod, handleClose }: PodLogsProps) {
  const [code, setCode] = useState<string>(JSON.stringify(selectedPod, null, 4));

  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    setCode(JSON.stringify(selectedPod, null, 4));
    setShowDiff(false);
  }, [selectedPod]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedPod?.metadata?.name ?? ""}
      description={
        <Switch.Group as="div" className="flex items-center">
          <Switch
            checked={showDiff}
            onChange={setShowDiff}
            className={`${
              showDiff ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Show Diff</span>
            <span
              className={`${
                showDiff ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 rounded-full bg-white transition`}
            />
          </Switch>
          <Switch.Label as="span" className="ml-3">
            <span className="text-sm font-medium text-gray-900">Diff Toggle</span>
          </Switch.Label>
        </Switch.Group>
      }
    >
      {showDiff ? (
        <DiffEditor
          language="json"
          original={JSON.stringify(selectedPod, null, 4)}
          modified={code}
        />
      ) : (
        <Editor
          defaultLanguage="json"
          defaultValue={code}
          onChange={(code) => setCode(code ?? "")}
        />
      )}
    </Drawer>
  );
}
