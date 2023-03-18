import { Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { Fragment } from "react";
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
        <div>
          <p className="font-bold">App updated to version {data?.version}.</p>
          <p>Please restart to apply changes.</p>
          <br />
          <p>Release Notes:</p>
          <p>{data?.body}</p>
        </div>
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

  const buttonText = updateMutation.isLoading
    ? "Updating..."
    : updateMutation.isSuccess
    ? "Restart Now"
    : "Update Available";

  return (
    <Transition
      as={Fragment}
      show={!updateAvailableQuery.isLoading}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 scale-50"
      enterTo="opacity-100 scale-100"
    >
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
    </Transition>
  );
}
