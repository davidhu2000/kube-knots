import {
  convertCpuToNanoCpu,
  convertMemoryToBytes,
  formatCpu,
  formatMemory,
} from "../helpers/unit-converter-helpers";

interface UsageProps {
  usage: string | undefined;
  request: string | undefined;
  maxWidth?: number;
}

export function CpuUsage({ usage, request, maxWidth = 40 }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertCpuToNanoCpu(usage);

  return (
    <ResourceUsage
      maxWidth={maxWidth}
      label={"CPU"}
      usage={usageNumber}
      request={convertCpuToNanoCpu(request)}
      formattedUsage={formatCpu(usageNumber)}
    />
  );
}

export function MemoryUsage({ usage, request, maxWidth = 40 }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertMemoryToBytes(usage);

  return (
    <ResourceUsage
      maxWidth={maxWidth}
      label={"Memory"}
      usage={usageNumber}
      request={convertMemoryToBytes(request)}
      formattedUsage={formatMemory(usageNumber)}
    />
  );
}

interface ResourceUsageProps {
  label: string;
  usage: number;
  request: number;
  maxWidth: number;
  formattedUsage: string;
}
function ResourceUsage({ label, usage, request, maxWidth, formattedUsage }: ResourceUsageProps) {
  const percent = Math.round((usage / request) * 100);

  return (
    <>
      <div className="flex justify-between" style={{ width: maxWidth }}>
        <div>{label}</div>
        <div>
          <span className="mt-1">{formattedUsage}</span>&sdot;
          <span className="mt-1">{percent}%</span>
        </div>
      </div>
      <div
        className="box-content h-3 overflow-hidden rounded-md border"
        style={{ width: maxWidth }}
      >
        <div
          className={`h-3 ${percent >= 80 ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: Math.min((percent * maxWidth) / 100, maxWidth) }}
        />
      </div>
    </>
  );
}
