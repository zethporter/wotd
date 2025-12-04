import * as React from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconTrashX,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateWrestler as uw } from "@/serverFunctions/tursoFunctions";
import type { WrestlerInsert } from "@/db/schema/app";

const updateWrestler = async (wrestler: WrestlerInsert) => {
  toast.loading("Saving wrestler...", { id: wrestler.id });
  try {
    const response = await uw({ data: wrestler });
    if (response.code === "SUCCESS") {
      toast.success(response.message, { id: wrestler.id });
    } else if (response.code === "WARN") {
      toast.warning(response.message, { id: wrestler.id });
    } else {
      toast.info("hmm...", { id: wrestler.id });
    }
  } catch {
    toast.error("Failed to save wrestler", { id: wrestler.id });
  }
};

export const schema = z.object({
  wrestler: z.object({
    id: z.string(),
    name: z.string(),
    school: z.string(),
  }),
  votes: z.object({
    wrestlerId: z.string().nullable(),
    totalVotes: z.number(),
  }),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorFn: (row) => row.wrestler.name,
    id: "name",
    enableGlobalFilter: true,
    header: "Name",
    cell: ({ row }) => (
      <div className="w-32">
        <span className="text-muted-foreground px-1.5 font-semibold">
          {row.original.wrestler.name}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.wrestler.school,
    id: "school",
    enableGlobalFilter: true,
    header: "School",
    cell: ({ row }) => (
      <span className="text-muted-foreground px-1.5">
        {row.original.wrestler.school}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.votes.totalVotes,
    id: "votes",
    enableGlobalFilter: true,
    header: "Votes",
    cell: ({ row }) => (
      <span className="text-muted-foreground px-1.5">
        {row.original.votes.totalVotes}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [name, setName] = React.useState(row.original.wrestler.name);
      const [school, setSchool] = React.useState(row.original.wrestler.school);
      return (
        <div className="flex w-full justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <IconEdit />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2 flex justify-between">
                  <h4 className="leading-none font-bold text-xl flex gap-1 items-center">
                    <IconEdit />
                    <span>Edit</span>
                  </h4>
                  <Button size="icon" variant="destructive">
                    <IconTrashX />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Name</Label>
                    <Input
                      defaultValue="100%"
                      className="col-span-2 h-8"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">School</Label>
                    <Input
                      defaultValue="300px"
                      className="col-span-2 h-8"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      updateWrestler({
                        id: row.original.wrestler.id,
                        name,
                        school,
                      })
                    }
                    size="default"
                    variant="secondary"
                  >
                    <IconDeviceFloppy /> <span>Save</span>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const data = React.useMemo(() => initialData, [initialData]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState<any>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.wrestler.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full flex flex-col px-5 justify-start gap-4">
      <Input
        value={globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        placeholder="Search"
        className="w-full @xl/main:w-7/12 @5xl/main:w-5/12 self-end"
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getPaginationRowModel().rows?.length ? (
              <React.Fragment>
                {table.getPaginationRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </React.Fragment>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
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
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
