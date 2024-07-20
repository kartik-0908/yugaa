import useSWR from "swr"
import { getUsers } from "../actions/analytics"
import { Select, SelectItem } from "@nextui-org/react"
import { updateAssignee } from "../actions/inbox"
import { useUser } from "@clerk/nextjs"

export default function AssignedTo({ id, assigneeId, shopDomain }: { id: string, shopDomain: string, assigneeId: string }) {
    const { user, isLoaded } = useUser()
    if (!isLoaded) return (<div>Loading...</div>)
    const { data, isLoading, error } = useSWR(
        `${shopDomain}`,
        getUsers)
    if (isLoading) {
        return null
    }
    console.log(`assigneeId: ${assigneeId}`)
    const modifiedData = [{ title: "Unassigned", key: "Unassigned" }]

    data?.map((user: any) => {
        modifiedData.push({ title: `${user.firstName} ${user.lastName}`, key: user.id })
    })
    const disabledKeys: any = []
    data?.map((user) => {
        if (user.availabe === false) {
            disabledKeys.push(user.id)
        }
    })
    console.log(`disabledKeys: ${disabledKeys}`)
    if (data != undefined) {
        return (
            <Select
                disabledKeys={disabledKeys}
                onSelectionChange={(key : any) => {
                    const arr = Array.from(key);
                    updateAssignee(id, arr[0] as string, user?.fullName as string, user?.publicMetadata.shopDomain as string)
                }}
                selectionMode="single"
                listboxProps={{
                    classNames: {
                        base: "m-0",
                        list: "m-0"
                    }
                }}
                label="Assigned To" className="max-w-[200px] m-0 p-0" size="sm" defaultSelectedKeys={assigneeId ? [assigneeId] : ["Unassigned"]}>
                {modifiedData?.map((user: any) => {
                    return (
                        <SelectItem className="m-0" key={user.key} >{user.title}</SelectItem>
                    )
                })
                }

            </Select >
        )
    }

}