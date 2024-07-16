import { useUser } from "@clerk/nextjs";
import { useDisclosure } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import useSWR from "swr";
import { getUsers } from "../../../actions/analytics";
import { useState } from "react";

export default function RestrictOperator() {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return <div>Loading...</div>
    }
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const { onOpen } = useDisclosure();
    const { data, isLoading, error } = useSWR(
        `${user?.publicMetadata.shopDomain}`,
        getUsers, {
        refreshInterval: 1000 ,
        keepPreviousData: true
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    

    console.log(data)

    if (!data) {
        return null;
    }

    let currentselected: Set<string>  = new Set();
    data.map((user)=>{
        if(user.availableForDist){
            currentselected.add(user.id)
        }
    })
    setSelected(currentselected)

    return (
        <Popover showArrow placement="right"
        classNames={{
            base:"shadow-none",
            content: [
                "bg-gradient-to-br from-white to-default-300",
              ],
        }}
        >
            <PopoverTrigger>
                <div className="flex flex-row gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><title>account-cancel</title><path d="M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M17.5 13C15 13 13 15 13 17.5C13 20 15 22 17.5 22C20 22 22 20 22 17.5C22 15 20 13 17.5 13M10 14C5.58 14 2 15.79 2 18V20H11.5A6.5 6.5 0 0 1 11 17.5A6.5 6.5 0 0 1 11.95 14.14C11.32 14.06 10.68 14 10 14M17.5 14.5C19.16 14.5 20.5 15.84 20.5 17.5C20.5 18.06 20.35 18.58 20.08 19L16 14.92C16.42 14.65 16.94 14.5 17.5 14.5M14.92 16L19 20.08C18.58 20.35 18.06 20.5 17.5 20.5C15.84 20.5 14.5 19.16 14.5 17.5C14.5 16.94 14.65 16.42 14.92 16Z" /></svg>
                    <button
                        className="group relative flex items-center justify-center   rounded-md "
                        onClick={onOpen}>Restrict Operator</button>
                </div>

            </PopoverTrigger>
            <PopoverContent  className="p-1 bg-transparent shadow-none"> 
                <div className="flex flex-col gap-3">
                    <Table
                    
                        color="primary"
                        className="shadow-none"
                        selectionMode="multiple"
                        aria-label="Example static collection table"
                        selectedKeys={selected}
                    >
                        <TableHeader>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>ROLE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell>{user.role || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </PopoverContent>
        </Popover>
    )
}