import type { PodMetric, V1Job, V1Node, V1Pod } from "@kubernetes/client-node";
import { type PropsWithChildren } from "react";

import { CpuUsage, MemoryUsage, ResourceUsage } from "../components/resource-usage";
import { convertCpuToNanoCpu, convertMemoryToBytes } from "../helpers/unit-converter-helpers";
import { useResourceList } from "../hooks/use-resource-list";
import { BarChart } from "./bar-chart";

function formatChartData<T>(data: T[], getStatus: (item: T) => string) {
  const countByStatus: { [key: string]: number } = {};

  for (const item of data) {
    const phase = getStatus(item);
    countByStatus[phase] = (countByStatus[phase] ?? 0) + 1;
  }

  const chartData = Object.entries(countByStatus)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return chartData;
}

export function RootView() {
  const {
    data: { items: pods },
  } = useResourceList<V1Pod>("get_pods");
  const podsData = formatChartData(pods, (pod) => pod.status?.phase ?? "");

  const {
    data: { items: jobs },
  } = useResourceList<V1Job>("get_jobs");
  const jobData = formatChartData(jobs, (item) => {
    const availableStatus = item.status?.conditions?.find((a) => a.type === "Complete");

    switch (availableStatus?.status) {
      case "True":
        return "Complete";
      case "False":
        return "Failed";
      default:
        return "Unknown";
    }
  });

  const {
    data: { items: podMetrics },
  } = useResourceList<PodMetric>("get_pod_metrics");

  const totalMemoryUsage = podMetrics.reduce((acc, item) => {
    const memoryInBytes = item.containers
      .map((a) => a.usage.memory)
      .reduce((acc, item) => acc + convertMemoryToBytes(item), 0);

    return acc + memoryInBytes;
  }, 0);

  const totalMemoryRequests = pods.reduce((acc, item) => {
    const memoryInBytes = (item.spec?.containers ?? [])
      .map((a) => a.resources?.requests?.memory)
      .reduce((acc, item) => acc + convertMemoryToBytes(item ?? "0"), 0);

    return acc + memoryInBytes;
  }, 0);

  const totalCpuUsage = podMetrics.reduce((acc, item) => {
    const cpuInBytes = item.containers
      .map((a) => a.usage.cpu)
      .reduce((acc, item) => acc + convertCpuToNanoCpu(item), 0);

    return acc + cpuInBytes;
  }, 0);

  const totalCpuRequests = pods.reduce((acc, item) => {
    const cpuInBytes = (item.spec?.containers ?? [])
      .map((a) => a.resources?.requests?.cpu)
      .reduce((acc, item) => acc + convertCpuToNanoCpu(item ?? "0"), 0);

    return acc + cpuInBytes;
  }, 0);

  const {
    data: { items: nodes },
  } = useResourceList<V1Node>("get_nodes");
  const kubeletVersions = [...new Set(nodes.map((node) => node.status?.nodeInfo?.kubeletVersion))];
  const totalPods = nodes.reduce((acc, node) => {
    const nodePods = node.status?.capacity?.pods ?? "0";
    return acc + parseInt(nodePods, 10);
  }, 0);

  const cpuAllocatable = nodes.reduce((acc, item) => {
    const cpuInBytes = convertCpuToNanoCpu(item.status?.allocatable?.cpu ?? "0");
    return acc + cpuInBytes;
  }, 0);
  const cpuCapacity = nodes.reduce((acc, item) => {
    const cpuInBytes = convertCpuToNanoCpu(item.status?.capacity?.cpu ?? "0");
    return acc + cpuInBytes;
  }, 0);

  const memoryAllocatable = nodes.reduce((acc, item) => {
    const memoryInBytes = convertMemoryToBytes(item.status?.allocatable?.memory ?? "0");
    return acc + memoryInBytes;
  }, 0);
  const memoryCapacity = nodes.reduce((acc, item) => {
    const memoryInBytes = convertMemoryToBytes(item.status?.capacity?.memory ?? "0");
    return acc + memoryInBytes;
  }, 0);

  return (
    <div>
      <SectionWrapper>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </SectionWrapper>

      <SectionWrapper title="Nodes">
        <div className="my-2 grid grid-cols-1 md:grid-cols-2">
          <div className="my-2">
            <div className="my-2">Version(s): {kubeletVersions.join(",")}</div>
            <div className="my-2">Nodes: {nodes.length}</div>

            <ResourceUsage
              label={"Pods"}
              currentValue={pods.length}
              maxValue={totalPods}
              barWidth={240}
              simpleLabel={false}
            />
          </div>

          <div className="my-2">
            <div className="font-bold">Node Allocations</div>
            <div className="my-2">
              <CpuUsage
                usage={`${cpuCapacity - cpuAllocatable}n`}
                request={`${cpuCapacity}n`}
                barWidth={240}
              />
            </div>

            <MemoryUsage
              usage={`${memoryCapacity - memoryAllocatable}`}
              request={`${memoryCapacity}`}
              barWidth={240}
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper title={`Pods (${pods.length})`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex">
            <div className="flex flex-col items-center">
              <BarChart data={podsData} barWidth={240} />
            </div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="mb-2">Usage vs Request</div>
            <div className="my-2">
              <CpuUsage
                usage={`${totalCpuUsage}n`}
                request={`${totalCpuRequests}n`}
                barWidth={240}
              />
            </div>
            <MemoryUsage
              usage={`${totalMemoryUsage}`}
              request={`${totalMemoryRequests}`}
              barWidth={240}
            />
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper title={`Jobs (${jobs.length})`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex">
            <div className="flex flex-col items-center">
              <BarChart data={jobData} barWidth={240} />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({ children, title }: PropsWithChildren & { title?: string }) {
  return (
    <div className="mb-4 gap-4 rounded-md bg-gray-200 p-6 shadow dark:bg-gray-700">
      {title && <h1 className="mb-2 text-xl font-bold tracking-tight">{title}</h1>}
      {children}
    </div>
  );
}
