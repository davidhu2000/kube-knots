export type CPU = `${number}` | `${number}m` | `${number}n`;

export function convertCpuToNanoCpu(cpu: CPU): number {
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

export type Memory =
  | `${number}`
  | `${number}Ei`
  | `${number}Gi`
  | `${number}Ki`
  | `${number}Mi`
  | `${number}Pi`
  | `${number}Ti`;

export function convertMemoryToBytes(memory: Memory) {
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
