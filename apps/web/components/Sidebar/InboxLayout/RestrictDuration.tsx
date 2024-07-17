// import { useUser } from "@clerk/nextjs";
// import { Input, useDisclosure } from "@nextui-org/react";
// import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
// import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
// import useSWR, { useSWRConfig } from "swr";
// import { getUsers } from "../../../actions/analytics";
// import { changeOperatorAvailability, updateOperatorAvailability, updateOperatorAvailabilityDays } from "../../../actions/inbox";

// export default function RestrictDuration() {
//     const { user, isLoaded } = useUser()
//     if (!isLoaded) {
//         return null;
//     }
//     const { mutate } = useSWRConfig()
//     const { onOpen } = useDisclosure();
//     const { data, isLoading, error } = useSWR(
//         `${user?.publicMetadata.shopDomain}`,
//         getUsers)
//     if (isLoading) {
//         return null
//     }
//     console.log(data)
//     if (!data) {
//         return null;
//     }
//     let currentselected: Set<string> = new Set();
//     data.map((user) => {
//         if (user.availableForDist) {
//             currentselected.add(user.id)
//         }
//     })

//     return (
//         <Popover showArrow placement="right"
//             classNames={{
//                 base: "shadow-none",
//             }}
//         >
//             <PopoverTrigger>
//                 <div className="flex flex-row gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" height={24} width={24} viewBox="0 0 24 24"><title>account-clock</title><path d="M10.63,14.1C12.23,10.58 16.38,9.03 19.9,10.63C23.42,12.23 24.97,16.38 23.37,19.9C22.24,22.4 19.75,24 17,24C14.3,24 11.83,22.44 10.67,20H1V18C1.06,16.86 1.84,15.93 3.34,15.18C4.84,14.43 6.72,14.04 9,14C9.57,14 10.11,14.05 10.63,14.1V14.1M9,4C10.12,4.03 11.06,4.42 11.81,5.17C12.56,5.92 12.93,6.86 12.93,8C12.93,9.14 12.56,10.08 11.81,10.83C11.06,11.58 10.12,11.95 9,11.95C7.88,11.95 6.94,11.58 6.19,10.83C5.44,10.08 5.07,9.14 5.07,8C5.07,6.86 5.44,5.92 6.19,5.17C6.94,4.42 7.88,4.03 9,4M17,22A5,5 0 0,0 22,17A5,5 0 0,0 17,12A5,5 0 0,0 12,17A5,5 0 0,0 17,22M16,14H17.5V16.82L19.94,18.23L19.19,19.53L16,17.69V14Z" /></svg>

//                     <button
//                         className="group relative flex items-center justify-center   rounded-md "
//                         onClick={onOpen}>Restrict Operator</button>
//                 </div>

//             </PopoverTrigger>
//             <PopoverContent className="p-1  shadow-none">
//                 <div className="flex flex-col gap-3">
//                     <Table
//                         color="primary"
//                         className="shadow-none"
//                         aria-label="Example static collection table"
//                         defaultSelectedKeys={currentselected}
//                     >
//                         <TableHeader>
//                             <TableColumn>NAME</TableColumn>
//                             <TableColumn>No. of days</TableColumn>
//                         </TableHeader>
//                         <TableBody>
//                             {data?.map((user) => (
//                                 <TableRow key={user.id}>
//                                     <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
//                                     <TableCell>
//                                         <Input onChange={(e) => {
//                                             console.log(user.id)
//                                             console.log(e.target.value)
//                                             if (e.target.value !== "") {
//                                                 updateOperatorAvailabilityDays(user.id, parseInt(e.target.value))
//                                                 mutate(`${user.shopDomain}`)
//                                             }
//                                         }} min={0} className="max-w-[70px]" maxLength={2} type="number" defaultValue={user.unAvailableDays.toString()}></Input>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </PopoverContent>
//         </Popover>
//     )
// }