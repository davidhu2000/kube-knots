import type { V1CronJob, V1Job } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

import { useCurrentContext } from "../providers/current-context-provider";
import { BaseModal, ModalButton } from "./modal";

const formatCronjobAsJob = (cronjob: V1CronJob): V1Job => {
  if (!cronjob.spec?.jobTemplate.spec?.template) {
    throw new Error("No job template found in cronjob");
  }

  return {
    apiVersion: "batch/v1",
    kind: "Job",
    metadata: {
      name: `${cronjob.metadata?.name}-manual-${Date.now()}`,
      namespace: cronjob.metadata?.namespace,
    },
    spec: {
      template: cronjob.spec?.jobTemplate.spec?.template,
    },
  };
};

interface ResourceTriggerModalProps {
  isOpen: boolean;
  handleClose: () => void;
  selectedResource: V1CronJob | null;
}
export function ResourceTriggerModal({
  isOpen,
  handleClose,
  selectedResource,
}: ResourceTriggerModalProps): JSX.Element {
  const { currentContext } = useCurrentContext();

  const triggerJobMutation = useMutation({
    mutationFn: (cronjob: V1CronJob) => {
      // TODO: update command if we support other types
      return invoke("create_job", {
        context: currentContext,
        namespace: cronjob.metadata?.namespace,
        job: formatCronjobAsJob(cronjob),
      });
    },
    onSuccess: (_data, variables) => {
      alert(`Job triggered ${variables.metadata?.name}`);
      handleClose();
    },
    onError: (_data) => {
      alert(_data);
    },
  });

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={`Trigger ${selectedResource?.metadata?.name}`}
    >
      {selectedResource ? (
        <>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Triggering a job for &quot;{selectedResource.metadata?.name}&quot;
            </p>
          </div>

          <ModalButton
            label="Trigger"
            onClick={() => triggerJobMutation.mutate(selectedResource)}
          />
        </>
      ) : (
        <div>Missing Resource to Trigger</div>
      )}
    </BaseModal>
  );
}
