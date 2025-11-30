import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((column, index) => (
              <TableHead key={index} className="font-semibold">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
              >
                {columns.map((column, colIndex) => {
                  let content;
                  if (column.cell) {
                    content = column.cell(row);
                  } else if (typeof column.accessor === 'function') {
                    content = column.accessor(row);
                  } else {
                    content = row[column.accessor] as React.ReactNode;
                  }
                  
                  return (
                    <TableCell key={colIndex}>
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
