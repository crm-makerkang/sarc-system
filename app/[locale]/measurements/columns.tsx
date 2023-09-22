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

import { UserInfo } from "@/types/types"

import axios from "axios"

export const columns: ColumnDef<UserInfo>[] = [
  {
    id: "select",
    accessorKey: "id",
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
      return <div>{t('name')}</div>
    },
  },
  {
    id: "card_no",
    accessorKey: "card_no",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t("card-no")}</div>
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <span
          className="flex flex-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-xl">{t('phone')}</div>
          <ArrowUpDown className="ml-2 mt-2 h-4 w-4" />
        </span>
      )
    },
  },

  {
    id: "email",
    accessorKey: "email",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t('email')}</div>
    },
  },

  {
    id: "gender",
    accessorKey: "gender",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t('gender')}</div>
    },
  },

  {
    accessorKey: "age",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <span
          className="flex flex-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-xl">{t('age')}</div>
          <ArrowUpDown className="ml-2 mt-2 h-4 w-4" />
        </span>
      )
    },
  },
  {
    id: "height",
    accessorKey: "height",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t('height')}</div>
    },
  },
  {
    id: "weight",
    accessorKey: "weight",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t('weight')}</div>
    },
  },
  // {
  //   accessorKey: "amount",
  //   header: () => {
  //     const t = useTranslations('sarc');
  //     return <div className="text-right">{t('amount')}</div>
  //   },
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"))
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount)

  //     return <div className="text-right font-medium">{formatted}</div>
  //   },
  // },

  {
    id: "actions",
    cell: ({ row }) => {
      const UserInfo = row.original
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
            {/* <DropdownMenuItem
              onClick={() => {
                //window.location.href = `/start/?id=${UserInfo.id}`
              }}
            >
              <div className={table_text_size}>{t("edit")}</div>
            </DropdownMenuItem> */}

            <DropdownMenuItem
              onClick={async () => {
                //navigator.clipboard.writeText(UserInfo.id);
                console.log(UserInfo.id)
                const res = await axios.get('/api/token/')
                if (res.data.privilege != 100) {
                  alert(t("no-privilege-to-delete-msg"));
                } else {
                  const comfirm = confirm(t("confirm-to-delete-msg"));
                  //delete the user with the id
                }

              }}
            >
              {/* Copy UserInfo ID */}
              <div className={table_text_size}>{t("delete")}</div>
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
