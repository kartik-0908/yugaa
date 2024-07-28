import useSWR from "swr"
import { getUsers } from "../actions/analytics"
import { updateAssignee } from "../actions/inbox"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"

export default function AssignedTo({ id, assigneeId, shopDomain }: { id: string, shopDomain: string, assigneeId: string }) {
    const { data, isLoading } = useSWR(
        `${shopDomain}`,
        getUsers)
    if (isLoading) {
        return null
    }
    console.log(`assigneeId: ${assigneeId}`)
    const modifiedData = [{ title: "Unassigned", key: "Unassigned", disabled: false }]
    console.log(data)

    data?.map((user: any) => {
        console.log(`user.available: ${user.available}`)
        modifiedData.push({ title: `${user.firstName} ${user.lastName}`, key: user.id, disabled: !user.available })
    })
    console.log(modifiedData)
    return (
        <Select value={assigneeId}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {modifiedData?.map((user: any) => {
                        return (
                            <SelectItem disabled={user.disabled} className={`m-0 hover:bg-gray-200 `} value={user.key} >{user.title}</SelectItem>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select >
    )
}
