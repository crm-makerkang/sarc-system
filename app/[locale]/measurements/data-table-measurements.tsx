"use client"

import { useEffect } from "react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import { table_text_size } from "@/Settings/settings"
import { rows_per_page } from "@/Settings/settings"
import { Loader2, Settings } from "lucide-react"
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
  getData: any
}

export function DataTableMeasurements<TData, TValue>({
  columns,
  data,
  getData,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations('sarc');

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const [loading, setLoading] = React.useState(false)

  const [userAutoUpdate, setUserAutoUpdate] = React.useState(false)
  const [userAutoUpdateInterval, setUserAutoUpdateInterval] = React.useState(false)

  const [delete_all, setDelete_all] = React.useState(false)

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

  // React.useEffect(() => {
  //   console.log("in users/data-table.tsx 90:", Object.keys(rowSelection).length, data);
  // }, [rowSelection])

  // more pagination control, see https://github.com/TanStack/table/tree/main/examples/react/pagination-controlled
  React.useEffect(() => {
    table.setPageSize(rows_per_page);
    // const interval = setTimeout(() => {
    //   setLoading(false)
    // }, 1000)
  }, [])

  React.useEffect(() => {
    console.log("userAutoUpdate:", userAutoUpdate)

    if (userAutoUpdate) {
      const autoUpdateInterval = window.setInterval(() => {
        getData()
      }, 3000)
      setUserAutoUpdateInterval(true)
    } else {
      // 雖然粗暴，但有用
      if (userAutoUpdateInterval != false) {
        window.location.reload();
      }
    }
  }, [userAutoUpdate])

  React.useEffect(() => {
    setDelete_all((Object.keys(rowSelection).length > 0) ? true : false);
  }, [rowSelection])

  return (
    <div>
      {loading && (
        <div className='float h-16 w-16 absolute top-1/5 left-1/2 -translate-x-8 -translate-y-8'>
          <Loader2 className="animate-spin  -ml-2 mr-2 h-16 w-16 opacity-75 "></Loader2>
        </div>
      )}

      <div className="flex items-center py-4">
        <Button id="addNewUserButton" className="bg-primary text-xl "
          onClick={() => { alert("Not implement yet") }}
        >
          {t("manual-add")}
        </Button>


        {delete_all && (
          <Button id="deleteAllButton" className="ml-4 text-xl bg-red-500"
            onClick={
              async () => {
                if (confirm(t("confirm-to-delete-msg"))) {

                  setLoading(true);

                  const delIds = [];

                  for (var i = 0; i < table.getFilteredSelectedRowModel().rows.length; i++) {
                    delIds.push(table.getFilteredSelectedRowModel().rows[i].getValue('select'));
                  }

                  const del_config = {
                    data: {
                      id: delIds
                    }
                  }

                  console.log("in measurements/data-table.tsx 187:", del_config);
                  const res = await axios.delete('/api/measurements', del_config);
                  if (!res.data.success) {
                    alert(t("delete-failed-msg"));
                  }

                  getData();
                  setRowSelection({});
                  setLoading(false);
                  // window.location.reload();
                }
              }
            }
          >
            {t("delet-selected-measurements")}
          </Button>
        )}


        <Input
          placeholder={t("filter-names")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={
            (event) => {
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
          }
          className={"ml-4 max-w-sm border-black " + table_text_size}
        />
        <Switch
          className="ml-24 text-xl"
          checked={userAutoUpdate}
          onCheckedChange={() => {
            const uub = document.getElementById("measureingUpdateButton");

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

        <Button id="measureingUpdateButton" variant="outline" className="ml-4 text-xl"
          onClick={() => {
            getData();
          }}
        >
          {t("manualUpdate")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={"ml-auto border-black " + table_text_size}>
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
                  > <div className={table_text_size}>
                      {/* {t(column.id)} next-intl not works */}
                      {i == 0 ? t("name") : null}
                      {i == 1 ? t("datetime") : null}
                      {i == 2 ? t("calf-grith") : null}
                      {i == 3 ? t("grip-strength") : null}
                      {i == 4 ? t("chair-standup") + t("5times") : null}
                      {i == 5 ? t("muscle-quantity") : null}
                      {i == 6 ? t("gait-speed") + t("4m") : null}
                      {i == 7 ? t("gait-speed") + t("6m") : null}
                      {i == 8 ? t("balance") : null}
                      {i == 9 ? t("actions") : null}
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
                <TableRow className={table_text_size}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={table_text_size}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {/* {loading ? (<div className="text-xl">{t('loading-data')} ... </div>) : (<div className="text-xl">{t('noData')}</div>)} */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">

        <div className={"flex-1 text-muted-foreground " + table_text_size}>
          {/* {table.getFilteredSelectedRowModel().rows.map((row) => (row.getValue('select') + "   "))} */}
          {table.getFilteredSelectedRowModel().rows.length}/{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className={"flex-1 text-muted-foreground " + table_text_size}>
          {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={table_text_size}
        >
          {t("prevPage")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={table_text_size}
        >
          {t("nextPage")}
        </Button>
      </div>
    </div>
  )
}
