import { convertCpuToNanoCpu, convertMemoryToBytes } from "../helpers/unit-converts";

interface UsageProps {
  label: string;
  usage: string | undefined;
  request: string | undefined;
}

export function CpuUsage({ label, usage, request }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  return (
    <ResourceUsage
      label={label}
      usage={convertCpuToNanoCpu(usage)}
      request={convertCpuToNanoCpu(request)}
    />
  );
}

export function MemoryUsage({ label, usage, request }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  return (
    <ResourceUsage
      label={label}
      usage={convertMemoryToBytes(usage)}
      request={convertMemoryToBytes(request)}
    />
  );
}

interface ResourceUsageProps {
  label: string;
  usage: number;
  request: number;
  maxWidth?: number;
}
export function ResourceUsage({ label, usage, request, maxWidth = 40 }: ResourceUsageProps) {
  const percent = Math.round((usage / request) * 100);

  return (
    <>
      <div className="flex justify-between" style={{ width: maxWidth }}>
        <div>{label}</div>
        <div>
          <span className="mt-1">{usage}</span>&sdot;<span className="mt-1">{percent}%</span>
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
