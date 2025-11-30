import { ReactNode } from 'react';

export interface Column<T = any> {
  header: string;
  accessor: ((row: T, index?: number) => ReactNode) | keyof T;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends { id?: string | number }>({ 
  data, 
  columns 
}: DataTableProps<T>) {
  const getValue = (row: T, column: Column<T>, index: number) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row, index);
    }
    return row[column.accessor as keyof T] as React.ReactNode;
  };

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`
                  px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-muted-foreground
                  ${column.className || ''}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`
                    px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-foreground
                    ${column.className || ''}
                  `}
                >
                  {getValue(row, column, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-sm md:text-base text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
