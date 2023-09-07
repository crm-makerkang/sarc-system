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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserInfo = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

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
    id: "status",
    accessorKey: "status",
    header: () => {
      const t = useTranslations('sarc');
      return <div>{t('Status')}</div>
    },
  },
  {
    accessorKey: "email",
    //header: "Email",
    header: ({ column }) => {
      const t = useTranslations('sarc');
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-xl">{t('Email')}</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: () => {
      const t = useTranslations('sarc');
      return <div className="text-right">{t('Amount')}</div>
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(UserInfo.id)}
            >
              {/* Copy UserInfo ID */}
              {t("copyUserInfoID")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                var msg = `UserID:${UserInfo.id}\nEmail:${UserInfo.email}`;
                alert(msg);
              }}
            >View customer</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                //api to delete record
                window.location.href = "/users";
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// export function get_columns(): ColumnDef<UserInfo>[] {
//   return [
//     {
//       accessorKey: "status",
//       header: "Status",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//     },
//     {
//       accessorKey: "amount",
//       header: "Amount",
//     },
//   ]
// }
