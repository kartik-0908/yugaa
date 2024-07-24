"use client"
import { useUser } from "@clerk/nextjs";
import { DataTable } from "./data-table";
import useSWR from "swr";
import { fetchKb } from "../../../actions/kb";
import { columns } from "./columns";

export default function Table() {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }
    const { data, isLoading } = useSWR({ shop: user?.publicMetadata.shopDomain, type: "kb" }, fetchKb, {
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