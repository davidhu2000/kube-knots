export function convertCpuToNanoCpu(cpu: string): number {
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

export function formatCpu(nanoCpu: number): string {
  if (nanoCpu / 1_000_000_000 >= 10) {
    return `${Math.round(nanoCpu / 1_000_000_000)}`;
  }

  if (nanoCpu / 1_000_000 >= 10) {
    return `${Math.round(nanoCpu / 1_000_000)}m`;
  }

  return `${nanoCpu}n`;
}

export function convertMemoryToBytes(memory: string) {
  const memoryValue = parseFloat(memory);
  if (isNaN(memoryValue)) {
    throw new Error(`Invalid memory value: ${memory}`);
  }

  if (memory.endsWith("E")) {
    return memoryValue * 1_000 ** 6;
  }

  if (memory.endsWith("P")) {
    return memoryValue * 1_000 ** 5;
  }

  if (memory.endsWith("T")) {
    return memoryValue * 1_000 ** 4;
  }

  if (memory.endsWith("G")) {
    return memoryValue * 1_000 ** 3;
  }

  if (memory.endsWith("M")) {
    return memoryValue * 1_000 ** 2;
  }

  if (memory.endsWith("K")) {
    return memoryValue * 1_000;
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

export function formatMemory(bytes: number): string {
  if (bytes / 1024 ** 6 >= 10) {
    return `${Math.round(bytes / 1024 ** 6)}Ei`;
  }

  if (bytes / 1024 ** 5 >= 10) {
    return `${Math.round(bytes / 1024 ** 5)}Pi`;
  }

  if (bytes / 1024 ** 4 >= 10) {
    return `${Math.round(bytes / 1024 ** 4)}Ti`;
  }

  if (bytes / 1024 ** 3 >= 10) {
    return `${Math.round(bytes / 1024 ** 3)}Gi`;
  }

  if (bytes / 1024 ** 2 >= 10) {
    return `${Math.round(bytes / 1024 ** 2)}Mi`;
  }

  return `${bytes}`;
}
