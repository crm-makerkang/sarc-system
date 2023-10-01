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

export const columns_measurements: ColumnDef<Measurement>[] = [
  {
    id: "select",
    accessorKey: "rid",
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
    id: "datetime",
    accessorKey: "datetime",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <span
          className="flex flex-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-xl">{t("datetime")}</div>
          <ArrowUpDown className="ml-2 mt-2 h-4 w-4" />
        </span>
      )
    },

    cell: ({ row }) => {
      return (
        <span className="flex flex-row items-center justify-center">{row.original.datetime}</span>
      )
    }
  },
  {
    id: "calf_grith",
    accessorKey: "calf_grith",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t("calf-grith")}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.calf_grith}
            <span className="text-sm">{(row.original.calf_grith != undefined) ? t('cm') : ""}</span>
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
    accessorKey: "balance",
    header: () => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-col items-center justify-center">{t('balance')} </div>)
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      if ((row.original.balanceA != undefined)  || (row.original.balanceB != undefined) || (row.original.balanceC != undefined))
      {
        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
              <img src="/img/sppb_A.png" className="w-[20px]"></img>
              { row.original.balanceA }
              <span className="text-sm">{t('seconds')}</span>
              <img src="/img/sppb_B.png" className="w-[18px] ml-2"></img>
              { row.original.balanceB }
              <span className="text-sm">{t('seconds')}</span>
              <img src="/img/sppb_C.png" className="w-[10px] ml-3"></img>
              { row.original.balanceC }
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
              onClick={async () => {
                console.log(row.original.rid)

                const res = await axios.get('/api/token/')
                if (res.data.privilege != 100) {
                  alert(t("no-privilege-to-delete-msg"));
                } else {
                  const comfirm = confirm(t("confirm-to-delete-msg"));
                  if (comfirm) {
                    const del_config = {
                      data: {
                        id: [row.original.rid]
                      }
                    }
                    console.log("in measurements/data-table.tsx 283:", del_config);
                    const res = await axios.delete('/api/measurements', del_config);
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