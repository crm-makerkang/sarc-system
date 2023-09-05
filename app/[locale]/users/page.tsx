// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import ProductList from '@/components/productlist'
import { useTranslations } from "next-intl"

import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 200,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 300,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 400,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 550,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 600,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 700,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 825,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 900,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 1025,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 1100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 1225,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 1300,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 1425,
      status: "processing",
      email: "example@gmail.com",
    },
  ]
}

export default async function Home() {
  const t = useTranslations('sarc');
  const data = await getData();

  columns[0].header = t("Status");
  //columns[1].header = t("Email");
  columns[2].header = t("Amount");

  return (
    <Container>
      {t("users")}

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </Container>
  );
}