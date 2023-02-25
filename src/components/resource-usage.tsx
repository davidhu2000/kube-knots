function convertCpuToNanoCpu(cpu: string): number {
  const cpuValue = parseFloat(cpu);
  if (isNaN(cpuValue)) {
    throw new Error(`Invalid CPU value: ${cpu}`);
  }

  if (cpu.endsWith("m")) {
    return cpuValue * 1_000_000;
  }

  if (cpu.endsWith("n")) {
    return cpuValue;
  }

  return cpuValue * 1_000_000_000;
}

function convertMemoryToBytes(memory: string) {
  const memoryValue = parseFloat(memory);
  if (isNaN(memoryValue)) {
    throw new Error(`Invalid memory value: ${memory}`);
  }

  if (memory.endsWith("Ki")) {
    return memoryValue * 1024;
  }

  if (memory.endsWith("Mi")) {
    return memoryValue * 1024 ** 2;
  }

  if (memory.endsWith("Gi")) {
    return memoryValue * 1024 ** 3;
  }

  if (memory.endsWith("Ti")) {
    return memoryValue * 1024 ** 4;
  }

  if (memory.endsWith("Pi")) {
    return memoryValue * 1024 ** 5;
  }

  if (memory.endsWith("Ei")) {
    return memoryValue * 1024 ** 6;
  }

  return memoryValue;
}

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
