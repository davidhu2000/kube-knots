import { useMutation, useQuery } from "@tanstack/react-query";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { toast } from "react-toastify";

async function update() {
  const { shouldUpdate, manifest } = await checkUpdate();
  if (!shouldUpdate) {
    return;
  }
  await installUpdate();
  return manifest;
}

export function UpdateButton() {
  const updateAvailableQuery = useQuery(["check-update"], checkUpdate);

  const updateMutation = useMutation({
    mutationFn: () => {
      return update();
    },
    onSuccess: (data) => {
      toast.success(
        <div>App updated to version {data?.version}. Please restart to apply changes.</div>
      );
    },
    onError: (error) => {
      toast.error(`Failed to update with error: ${error}`);
    },
  });

  const restartMutation = useMutation({
    mutationFn: () => {
      return relaunch();
    },
    onError: (error) => {
      toast.error(`Failed to restart with error: ${error}`);
    },
  });

  if (updateAvailableQuery.isLoading) {
    return null;
  }

  const buttonText = updateMutation.isLoading
    ? "Updating..."
    : updateMutation.isSuccess
    ? "Restart Now"
    : "Update Available";

  return (
    <button
      onClick={() => {
        if (updateMutation.isSuccess) {
          restartMutation.mutate();
        } else {
          updateMutation.mutate();
        }
      }}
      disabled={updateMutation.isLoading}
      className="rounded-lg border-2 border-green-600/75 p-2 text-green-600/75 transition duration-200 hover:border-green-600 hover:text-green-600 dark:border-green-500/75 dark:text-green-500/75 dark:hover:border-green-500 dark:hover:text-green-500"
    >
      {buttonText}
    </button>
  );
}
