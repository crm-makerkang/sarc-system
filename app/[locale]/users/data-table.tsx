"use client"

import { useEffect } from "react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
// import { table_text_size } from "@/Settings/settings"
// import { rows_per_page } from "@/Settings/settings"
import axios from "axios"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getUsers: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getUsers,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations('sarc');

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const [loading, setLoading] = React.useState(true)

  const [userAutoUpdate, setUserAutoUpdate] = React.useState(false)
  const [userAutoUpdateInterval, setUserAutoUpdateInterval] = React.useState(false)

  const [settings, setSettings] = React.useState({
    table_text_size: "",
    rows_per_page: "",
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  var autoUpdate = false


  useEffect(() => {
    const getSettings = async () => {
      const res = await axios.get('/api/settings/')
      console.log(res.data);
      setSettings({
        table_text_size: JSON.parse(res.data.message).table_text_size,
        rows_per_page: JSON.parse(res.data.message).rows_per_page
      })

      table.setPageSize(parseInt(JSON.parse(res.data.message).rows_per_page));
    }

    getSettings();

  }, [])

  // more pagination control, see https://github.com/TanStack/table/tree/main/examples/react/pagination-controlled
  React.useEffect(() => {
    const interval = setTimeout(() => {
      setLoading(false)
    }, 3000)

  }, [])

  React.useEffect(() => {
    console.log("userAutoUpdate:", userAutoUpdate)

    if (userAutoUpdate) {
      const autoUpdateInterval = window.setInterval(() => {
        getUsers()
      }, 3000)
      setUserAutoUpdateInterval(true)
    } else {
      // 雖然粗暴，但有用
      if (userAutoUpdateInterval != false) {
        window.location.reload();
      }
    }
  }, [userAutoUpdate])

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={t("filter-names")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={
            (event) => {
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
          }
          className={"max-w-sm border-black " + settings.table_text_size}
        />
        <Switch
          className="ml-24 text-xl"
          checked={userAutoUpdate}
          onCheckedChange={() => {
            const uub = document.getElementById("userUpdateButton");

            if (!userAutoUpdate) {
              uub!.innerHTML = t("autoUpdate");
              uub!.setAttribute("disabled", "");
            } else {
              uub!.innerHTML = t("manualUpdate");
              uub!.removeAttribute("disabled");
            }

            setUserAutoUpdate(!userAutoUpdate);
          }}
        >
          {t("autoUpdate")}
        </Switch>

        <Button id="userUpdateButton" variant="outline" className="ml-4 text-xl"
          onClick={() => {
            getUsers();
          }}
        >
          {t("manualUpdate")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={"ml-auto border-black " + settings.table_text_size}>
              {t("columns")} {/* next-intl works */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column, i) => {
                const t = useTranslations('sarc');
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  > <div className={settings.table_text_size}>
                      {/* {t(column.id)} next-intl not works */}
                      {i == 0 ? t("name") : null}
                      {i == 1 ? t("email") : null}
                      {i == 2 ? t("phone") : null}
                      {i == 3 ? t("gender") : null}
                      {i == 4 ? t("age") : null}
                      {i == 5 ? t("actions") : null}
                      {/* {column.id} */}
                    </div>
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-gray-500">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={"text-primary font-bold text-xl"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className={settings.table_text_size}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={settings.table_text_size}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? (<div className="text-xl">{t('loading-data')} ... </div>) : (<div className="text-xl">{t('noData')}</div>)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">

        <div className={"flex-1 text-muted-foreground " + settings.table_text_size}>
          {table.getFilteredSelectedRowModel().rows.map((row) => (row.getValue('select')))} {" "}
          {table.getFilteredSelectedRowModel().rows.length}/{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className={"flex-1 text-muted-foreground " + settings.table_text_size}>
          {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={settings.table_text_size}
        >
          {t("prevPage")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={settings.table_text_size}
        >
          {t("nextPage")}
        </Button>
      </div>
    </div>
  )
}
