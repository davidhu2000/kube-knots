import { convertCpuToNanoCpu, convertMemoryToBytes } from "../helpers/unit-converts";

interface CpuUsageProps {
  usage: string | undefined;
  request: string | undefined;
}
export function CpuUsage({ usage, request }: CpuUsageProps) {
  if (!usage || !request) {
    return null;
  }

  return (
    <ResourceUsage usage={convertCpuToNanoCpu(usage)} request={convertCpuToNanoCpu(request)} />
  );
}

interface MemoryUsageProps {
  usage: string | undefined;
  request: string | undefined;
}
export function MemoryUsage({ usage, request }: MemoryUsageProps) {
  if (!usage || !request) {
    return null;
  }

  return (
    <ResourceUsage usage={convertMemoryToBytes(usage)} request={convertMemoryToBytes(request)} />
  );
}

interface ResourceUsageProps {
  usage: number;
  request: number;
}
function ResourceUsage({ usage, request }: ResourceUsageProps) {
  const percent = Math.round((usage / request) * 100);

  return (
    <div className="">
      <div className="box-content h-4 w-10 rounded-sm border">
        <div
          className={`h-4 ${percent >= 80 ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: Math.min((percent * 40) / 100, 40) }}
        />
      </div>
      <div className="mt-1">{percent}%</div>
    </div>
  );
}
