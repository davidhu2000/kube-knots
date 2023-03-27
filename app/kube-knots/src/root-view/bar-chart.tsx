interface BarChartProps {
  data: { name: string; value: number }[];
  barWidth: number;
}

export function BarChart({ data, barWidth }: BarChartProps) {
  // uncomment to test the component with multiple bars
  // data = [
  //   { name: "Running", value: 10 },
  //   { name: "Success", value: 20 },
  //   { name: "Unknown", value: 23 },
  // ];

  const maxValue = Math.max(...data.map((item) => item.value));

  const labels = data.map((item) => item.name);
  const values = data.map((item) => item.value);

  return (
    <div className="flex">
      <div className="mr-2 flex flex-col justify-between text-sm">
        {labels.map((label, idx) => (
          <div key={`${label}-${idx}`} className="my-1">
            {label}
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between text-sm">
        {values.map((value, idx) => (
          <div
            key={`${value}-${idx}`}
            style={{ width: barWidth * (value / maxValue) }}
            className="my-1 rounded-md border bg-green-600 px-2 text-gray-200"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}
