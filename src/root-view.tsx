import type { PodMetric, V1Job, V1Pod } from "@kubernetes/client-node";
import { type ComponentProps, useState, type PropsWithChildren } from "react";
import { PieChart, Pie, Sector } from "recharts";

import { convertCpuToNanoCpu, convertMemoryToBytes } from "./helpers/unit-converts";
import { useResourceList } from "./hooks/use-resource-list";

type ActiveShapeComponent = ComponentProps<typeof Pie>["activeShape"];

const noResourceName = "No resources";

const renderActiveShape: ActiveShapeComponent = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name} {payload.name === noResourceName ? 0 : payload.value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

function DoughnutChart({ data }: { data: { name: string; value: number }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  return (
    <PieChart width={200} height={200}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data.length === 0 ? [{ name: noResourceName, value: 1 }] : data}
        innerRadius={60}
        outerRadius={80}
        fill={data.length === 0 ? "#ccc" : "#8884d8"}
        dataKey="value"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
  );
}

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
  const { data: pods } = useResourceList<V1Pod>("get_pods");
  const podsData = formatChartData(pods.items, (pod) => pod.status?.phase ?? "");

  const { data: jobs } = useResourceList<V1Job>("get_jobs");
  const jobData = formatChartData(jobs.items, (item) => {
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

  const { data: podMetrics } = useResourceList<PodMetric>("get_pod_metrics");

  const totalMemoryUsage = podMetrics.items.reduce((acc, item) => {
    const memoryInBytes = item.containers
      .map((a) => a.usage.memory)
      .reduce((acc, item) => acc + convertMemoryToBytes(item), 0);

    return acc + memoryInBytes;
  }, 0);

  const totalMemoryRequests = pods.items.reduce((acc, item) => {
    const memoryInBytes = (item.spec?.containers ?? [])
      .map((a) => a.resources?.requests?.memory)
      .reduce((acc, item) => acc + convertMemoryToBytes(item ?? "0"), 0);

    return acc + memoryInBytes;
  }, 0);

  const memoryUsagePercent = (totalMemoryUsage / totalMemoryRequests) * 100;

  const totalCpuUsage = podMetrics.items.reduce((acc, item) => {
    const cpuInBytes = item.containers
      .map((a) => a.usage.cpu)
      .reduce((acc, item) => acc + convertCpuToNanoCpu(item), 0);

    return acc + cpuInBytes;
  }, 0);

  const totalCpuRequests = pods.items.reduce((acc, item) => {
    const cpuInBytes = (item.spec?.containers ?? [])
      .map((a) => a.resources?.requests?.cpu)
      .reduce((acc, item) => acc + convertCpuToNanoCpu(item ?? "0"), 0);

    return acc + cpuInBytes;
  }, 0);

  const cpuUsagePercent = (totalCpuUsage / totalCpuRequests) * 100;

  return (
    <div>
      <SectionWrapper>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </SectionWrapper>

      <SectionWrapper>
        <div className="flex flex-col items-center">
          Pods ({pods.items.length})
          <DoughnutChart data={podsData} />
        </div>

        <div className="flex flex-col items-center">
          Jobs ({jobs.items.length})
          <DoughnutChart data={jobData} />
        </div>

        <div className="flex h-full flex-col items-center">
          {totalMemoryUsage} / {totalMemoryRequests}
          <div className="box-content h-3 w-60 overflow-hidden rounded-md border">
            <div
              className={`h-3 ${memoryUsagePercent >= 80 ? "bg-red-500" : "bg-green-500"}`}
              style={{
                width: Math.min((memoryUsagePercent * 240) / 100, 240),
              }}
            />
          </div>
          <br />
          {totalCpuUsage} / {totalCpuRequests}
          <div className="box-content h-3 w-60 overflow-hidden rounded-md border">
            <div
              className={`h-3 ${cpuUsagePercent >= 80 ? "bg-red-500" : "bg-green-500"}`}
              style={{
                width: Math.min((cpuUsagePercent * 240) / 100, 240),
              }}
            />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({ children }: PropsWithChildren) {
  return (
    <div className="mb-4 flex flex-wrap gap-4 rounded-md bg-gray-100 p-6 shadow dark:bg-gray-700">
      {children}
    </div>
  );
}
