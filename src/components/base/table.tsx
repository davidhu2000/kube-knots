export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="min-w-full select-text divide-y divide-gray-300 rounded-md border-2 border-solid dark:divide-gray-600 dark:border-gray-700">
      {children}
    </table>
  );
}

export function TableHeader({ headers }: { headers: string[] }) {
  return (
    <thead className="bg-gray-200 dark:bg-gray-700">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            scope="col"
            className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-700 dark:text-gray-300"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
      {children}
    </tbody>
  );
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="max-w-xs overflow-scroll whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
      {children}
    </td>
  );
}
