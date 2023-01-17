import { type V1Pod } from "@kubernetes/client-node";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";

import { Drawer } from "../components/drawer";

interface PodLogsProps {
  isOpen: boolean;
  selectedPod: V1Pod | null;
  handleClose: () => void;
}

export default function PodEdit({ isOpen, selectedPod, handleClose }: PodLogsProps) {
  const [code, setCode] = useState(JSON.stringify(selectedPod));

  useEffect(() => {
    setCode(JSON.stringify(selectedPod));
  }, [selectedPod]);

  return (
    <Drawer
      isOpen={isOpen}
      handleClose={handleClose}
      title={selectedPod?.metadata?.name ?? ""}
      description={``}
    >
      <Editor
        className="h-full overflow-y-scroll rounded-md bg-gray-200 p-4 text-sm"
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.json, "json")}
        style={{ padding: 16 }}
      />
    </Drawer>
  );
}
