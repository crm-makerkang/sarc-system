"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTranslations } from "next-intl"
import { table_text_size } from "@/Settings/settings"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { Measurement } from "@/types/types"

import axios from "axios"

export const columns_measuring: ColumnDef<Measurement>[] = [
  {
    id: "select",
    accessorKey: "uid",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t('name')}</div>
    },
    cell: ({ row }) => {
      return (
        <span className="flex flex-row items-center justify-center">{row.original.name}</span>
      )
    }
  },
  {
    id: "calf_girth",
    accessorKey: "calf_girth",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t("calf-girth")}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.calf_girth}
            <span className="text-sm">{(row.original.calf_girth != undefined) ? t('cm') : ""}</span>
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "grip_strength",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">{t('grip-strength')}</div>
      )
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.grip_strength}
            <span className="text-sm">{(row.original.grip_strength != undefined) ? t('kgs') : ""}</span>
          </span>
        </div>
      )
    }
  },
  {
    id: "chair_standup5",
    accessorKey: "chair_standup5",
    header: () => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">
          <div>{t('chair-standup')}</div>
          <div>({t('5times')})</div>
        </div>)
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.chair_standup5}
            <span className="text-sm">{(row.original.chair_standup5 != undefined) ? t('seconds') : ""}</span>
          </span>
        </div>
      )
    }
  },

  {
    accessorKey: "muscle_quantity",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">
          <div>{t('muscle-quantity')}</div>
          <div>(ASMI)</div>
        </div>
      )
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.muscle_quantity}
            <span className="text-sm">{(row.original.muscle_quantity != undefined) ? t('asmi') : ""}</span>
          </span>
        </div>
      )
    }
  },
  {
    id: "gait_speed4",
    accessorKey: "gait_speed4",
    header: () => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">
          <div>{t('gait-speed')}</div>
          <div>({t('4m')})</div>
        </div>
      )
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.gait_speed4}
            <span className="text-sm">{(row.original.gait_speed4 != undefined) ? t('seconds') : ""}</span>
          </span>
        </div>
      )
    }
  },
  {
    id: "gait_speed6",
    accessorKey: "gait_speed6",
    header: () => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">
          <div>{t('gait-speed')}</div>
          <div>({t('6m')})</div>
        </div>
      )
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.gait_speed6}
            <span className="text-sm">{(row.original.gait_speed6 != undefined) ? t('seconds') : ""}</span>
          </span>
        </div>
      )
    }
  },

  {
    id: "balance",
    accessorKey: "balanceA",
    header: () => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">{t('balance')} </div>)
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      if ((row.original.balanceA != undefined) || (row.original.balanceB != undefined) || (row.original.balanceC != undefined)) {
        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
              <img src="/img/sppb_A.png" className="w-[20px]"></img>
              {row.original.balanceA}
              <span className="text-sm">{t('seconds')}</span>
              <img src="/img/sppb_B.png" className="w-[18px] ml-2"></img>
              {row.original.balanceB}
              <span className="text-sm">{t('seconds')}</span>
              <img src="/img/sppb_C.png" className="w-[10px] ml-3"></img>
              {row.original.balanceC}
              <span className="text-sm">{t('seconds')}</span>
            </div>
          </div>
        )
      } else
        return (
          <div className="flex flex-row items-center justify-center">
          </div>
        )
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuItem
              onClick={
                async () => {
                  console.log("in measurement page 249:", row.index, row.original)

                  if (confirm(t("confirm-to-save-to-records-msg"))) {
                    // save to records
                    const new_record = {
                      "datetime": row.original.datetime,
                      "calf_girth": row.original.calf_girth,
                      "grip_strength": row.original.grip_strength,
                      "chair_standup5": row.original.chair_standup5,
                      "muscle_quantity": row.original.muscle_quantity,
                      "gait_speed4": row.original.gait_speed4,
                      "gait_speed6": row.original.gait_speed6,
                      "balanceA": row.original.balanceA,
                      "balanceB": row.original.balanceB,
                      "balanceC": row.original.balanceC,
                      "uid": row.original.uid
                    }

                    const post_res = await axios.post('/api/measurements?cmd=writeToRecords', new_record);
                    if (post_res.data.success) {
                      window.location.reload();
                    } else {
                      alert(t("save-failed-msg"));
                      return
                    }

                    // delete in_measure
                    const del_config = {
                      data: {
                        id: [row.index]
                      }
                    }
                    const del_res = await axios.delete('/api/measurements?type=measuring', del_config);
                    if (del_res.data.success) {
                      window.location.reload();
                    } else {
                      alert(t("delete-failed-msg"));
                    }
                  }

                }
              }
            >
              <div className={table_text_size}>{t("save-to-record")}</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={
                async () => {
                  console.log("in measurement page 296:", row.index, row.original)
                  window.location.href = "/measurements?did=" + row.index.toString();
                }
              }
            >
              <div className={table_text_size}>{t("edit")}</div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                console.log(row.index)

                const res = await axios.get('/api/token/')
                if (res.data.privilege != 100) {
                  alert(t("no-privilege-to-delete-msg"));
                } else {
                  const comfirm = confirm(t("confirm-to-delete-msg"));
                  if (comfirm) {
                    const del_config = {
                      data: {
                        id: [row.index]
                      }
                    }
                    const res = await axios.delete('/api/measurements?type=measuring', del_config);
                    if (res.data.success) {
                      window.location.reload();
                    } else {
                      alert(t("delete-failed-msg"));
                    }
                  }
                }
              }}
            >
              <div className={table_text_size}>{t("delete")}</div>
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]