"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"
import { Button, buttonVariants } from "../../../components/ui/button"
import Link from "next/link"
import ViewButton from "./ViewButton"
import { deleteDoc, deleteLink } from "../../../actions/kb"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type KbTable = {
    type: "link" | "doc"
    shopDomain: string
    id: string
    name: string
    status: string
    url: string
}

export const columns: ColumnDef<KbTable>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
            if (row.original.type === "link") {
                return (
                    <Link href={row.original.url} target="_blank" className={buttonVariants({ variant: "outline" })}>Click here</Link>
                )
            }
            else if (row.original.type === "doc") {
                return (
                    <ViewButton id={row.original.id} name={row.original.name} shopDomain={row.original.shopDomain} />
                )
            }

        }
    },
    {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const currRow = row.original

            return (
                <>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={currRow.status === "processing" || currRow.status === "deleting" || currRow.status === "deleted"} className=" bg-transparent hover:bg-transparent" >
                                <Trash2 className="text-black mr-2 h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this data and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500" onClick={() => {
                                    console.log(currRow)
                                    if (currRow.type === "link") {
                                        deleteLink(currRow.id)
                                    }
                                    else if (currRow.type === "doc") {
                                        deleteDoc(currRow.id)
                                    }
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </>
            )
        },
    },
]
