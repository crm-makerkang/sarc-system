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

import { InMeasuring } from "@/types/types"

import axios from "axios"

export const columns_measuring: ColumnDef<InMeasuring>[] = [
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
    id: "calf_grith",
    accessorKey: "calf_grith",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t("calf-grith")}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <span className="flex flex-row items-center justify-center">{row.original.calf_grith}<span className="text-sm">{t('cm')}</span></span>
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
        <span className="flex flex-row items-center justify-center">{row.original.grip_strength}<span className="text-sm">{t('kgs')}</span></span>
      )
    }
  },
  {
    id: "chair_standup5",
    accessorKey: "chair_standup5",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t('chair-standup5')}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.chair_standup5} <span className="text-sm">{t('seconds')}</span> </span>
        </div>
      )
    }
  },

  {
    accessorKey: "muscle_quantity",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">{t('muscle-quantity')}</div>
      )
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.muscle_quantity} <span className="text-sm">{t('asmi')}</span> </span>
        </div>
      )
    }
  },
  {
    id: "gait_speed4",
    accessorKey: "gait_speed4",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t('gait-speed4')}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.gait_speed4} <span className="text-sm">{t('seconds')}</span> </span>
        </div>
      )
    }
  },
  {
    id: "gait_speed6",
    accessorKey: "gait_speed6",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="flex flex-row items-center justify-center">{t('gait-speed6')}</div>
    },
    cell: ({ row }) => {
      const t = useTranslations('sarc');
      return (
        <div className="flex flex-row items-center justify-center">
          <span >{row.original.gait_speed6} <span className="text-sm">{t('seconds')}</span> </span>
        </div>
      )
    }
  },
  // {
  //   id: "weight",
  //   accessorKey: "weight",
  //   header: () => {
  //     const t = useTranslations('sarc');
  //     return <div>{t('weight')}</div>
  //   },
  // },

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
              onClick={() => {
                window.location.href = `/start/?id=${row.original.uid}`
              }}
            >
              <div className={table_text_size}>{t("edit")}</div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                console.log(row.original.uid)

                const res = await axios.get('/api/token/')
                if (res.data.privilege != 100) {
                  alert(t("no-privilege-to-delete-msg"));
                } else {
                  const comfirm = confirm(t("confirm-to-delete-msg"));
                  if (comfirm) {
                    const del_config = {
                      data: {
                        id: row.original.uid
                      }
                    }
                    const res = await axios.delete('/api/users/', del_config);
                    if (!res.data.success) {
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