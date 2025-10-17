'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { DownloadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PdfDownloadButton } from '@/components/pdf';
import { EventReportTemplate } from '../pdf/EventReportTemplate';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EventPerformanceData {
  eventName: string;
  capacity: number;
  booked: number;
  sellThrough: number;
  actualRevenue: number;
  expectedRevenue: number;
}

export const columns: ColumnDef<EventPerformanceData>[] = [
  {
    accessorKey: 'eventName',
    header: 'Event',
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
  },
  {
    accessorKey: 'booked',
    header: 'Booked',
  },
  {
    accessorKey: 'sellThrough',
    header: 'Sell-Through',
    cell: ({ row }) => `${row.original.sellThrough.toFixed(1)}%`,
  },
  {
    accessorKey: 'actualRevenue',
    header: 'Actual Revenue',
    cell: ({ row }) => `$${row.original.actualRevenue.toFixed(2)}`,
  },
  {
    accessorKey: 'expectedRevenue',
    header: 'Expected Revenue',
    cell: ({ row }) => `$${row.original.expectedRevenue.toFixed(2)}`,
  },
];

interface EventsDataTableProps {
  data: EventPerformanceData[];
}

export function EventsDataTable({ data }: EventsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold">Event Performance</h3>
        <PdfDownloadButton
          document={<EventReportTemplate data={table.getRowModel().rows.map(row => row.original)} />}
          fileName={`Event_Performance_Report_${new Date().toISOString().split('T')[0]}`}
          buttonDisplay={<DownloadIcon className="h-4 w-4" />}
          variant="outline"
          size="sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-4 py-4 pr-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
