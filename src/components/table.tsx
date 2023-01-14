export function Table({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full divide-y divide-gray-300 rounded-md">{children}</table>;
}

export function TableHeader({ headers }: { headers: string[] }) {
  return (
    <thead className="bg-gray-200">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            scope="col"
            className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{children}</td>;
}
