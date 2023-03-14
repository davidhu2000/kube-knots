import {
  convertCpuToNanoCpu,
  convertMemoryToBytes,
  formatCpu,
  formatMemory,
} from "../helpers/unit-converter-helpers";

interface UsageProps {
  usage: string | undefined;
  request: string | undefined;
  barWidth?: number;
  simpleLabel?: boolean;
}

export function CpuUsage({ usage, request, barWidth = 40, simpleLabel = false }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertCpuToNanoCpu(usage);

  return (
    <ResourceUsage
      simpleLabel={simpleLabel}
      barWidth={barWidth}
      label={"CPU"}
      currentValue={usageNumber}
      maxValue={convertCpuToNanoCpu(request)}
      valueFormatter={formatCpu}
    />
  );
}

export function MemoryUsage({ usage, request, barWidth = 40, simpleLabel = false }: UsageProps) {
  if (!usage || !request) {
    return null;
  }

  const usageNumber = convertMemoryToBytes(usage);

  return (
    <ResourceUsage
      simpleLabel={simpleLabel}
      barWidth={barWidth}
      label={"Memory"}
      currentValue={usageNumber}
      maxValue={convertMemoryToBytes(request)}
      valueFormatter={formatMemory}
    />
  );
}

interface ResourceUsageProps {
  label: string;
  currentValue: number;
  maxValue: number;
  barWidth: number;
  valueFormatter?: (value: number) => string;
  simpleLabel: boolean;
}
export function ResourceUsage({
  label,
  currentValue,
  maxValue,
  barWidth,
  valueFormatter = (value) => value.toString(),
  simpleLabel,
}: ResourceUsageProps) {
  const percent = Math.round((currentValue / maxValue) * 100) || 0;

  const renderLabel = () => {
    if (simpleLabel) {
      return <div>{valueFormatter(currentValue)}</div>;
    }

    return (
      <>
        <div>{label}</div>
        <div>
          <span>
            {valueFormatter(currentValue)} / {valueFormatter(maxValue)}
          </span>
          &sdot;
          <span>{percent}%</span>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-between text-sm" style={{ width: barWidth }}>
        {renderLabel()}
      </div>
      <div
        className="box-content h-3 overflow-hidden rounded-md border border-gray-400 bg-gray-300 dark:bg-gray-500"
        style={{ width: barWidth }}
      >
        <div
          className={`h-3 ${percent >= 80 ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: Math.min((percent * barWidth) / 100, barWidth) }}
        />
      </div>
    </>
  );
}
