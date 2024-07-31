"use client"
import { DataTable } from "./data-table";
import useSWR from "swr";
import { fetchKb } from "../../../actions/kb";
import { columns } from "./columns";

export default function Table({ shopDomain }: { shopDomain: string }) {
    const { data } = useSWR({ shop: shopDomain, type: "kb" }, fetchKb, {
        refreshInterval: 1000,
    })
    if (data === undefined) {
        return (
            null
        )
    }
    return (
        <DataTable columns={columns} data={data} />
    )
}