import { type V1Job, type V1CronJob } from "@kubernetes/client-node";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { formatDistance } from "date-fns";
import { Suspense } from "react";

import { ActionGroup, ActionButton } from "../components/action-group";
import { ResourceEditDrawer } from "../components/resource-edit-drawer";
import { Table, TableHeader, TableBody, TableCell } from "../components/table";
import { useResourceActions } from "../hooks/use-resource-actions";
import { useResourceList } from "../hooks/use-resource-list";

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

export function CronJobs() {
  const {
    data: { items },
  } = useResourceList<V1CronJob>("get_cron_jobs");

  const { selected, handleOpen, handleClose, action } = useResourceActions<V1CronJob, "edit">();

  const triggerJobMutation = useMutation({
    mutationFn: (cronjob: V1CronJob) => {
      return invoke("create_job", {
        namespace: cronjob.metadata?.namespace,
        job: formatCronjobAsJob(cronjob),
      });
    },
    onSuccess: (_data, variables) => {
      alert(`Job triggered ${variables.metadata?.name}`);
    },
  });

  return (
    <div>
      <Table>
        <TableHeader headers={["Name", "Schedule", "Last Run", "Actions"]} />
        <TableBody>
          {items.map((item) => (
            <tr key={item.metadata?.uid}>
              <TableCell>{item.metadata?.name}</TableCell>
              <TableCell>{item.spec?.schedule}</TableCell>
              <TableCell>
                {item.status?.lastScheduleTime &&
                  formatDistance(new Date(item.status.lastScheduleTime), new Date(), {
                    addSuffix: true,
                  })}
              </TableCell>
              <TableCell>
                <ActionGroup>
                  <ActionButton
                    label="trigger"
                    position="left"
                    onClick={() => triggerJobMutation.mutate(item)}
                  />

                  <ActionButton
                    label="edit"
                    position="right"
                    onClick={() => handleOpen(item, "edit")}
                  />
                </ActionGroup>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Suspense fallback={<div>Loading Editor</div>}>
        <ResourceEditDrawer
          isOpen={action === "edit"}
          handleClose={handleClose}
          selectedResource={selected}
        />
      </Suspense>
    </div>
  );
}
