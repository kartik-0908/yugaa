import { useUser } from "@clerk/nextjs";
import { useDisclosure } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { getUsers } from "../../../actions/analytics";
import { updateOperatorAvailability } from "../../../actions/inbox";
import { Checkbox } from "../../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react";
import { useToasts } from "@geist-ui/core";
const FormSchema = z.object({
    selectedItems: z.array(z.string()),
    unselectedItems: z.array(z.string())
})

export default function RestrictOperator() {
    const { user, isLoaded } = useUser()
    if (!isLoaded) {
        return null;
    }
    const {setToast} = useToasts()
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [data, setData] = useState<any[]>([]);
    const [unselectedItems, setUnselectedItems] = useState<Set<string>>(new Set());
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            selectedItems: [],
            unselectedItems: []
        },
    })

    const handleCheckboxChange = (userId: string, checked: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(userId);
            } else {
                newSet.delete(userId);
            }
            return newSet;
        });

        setUnselectedItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });

        form.setValue('selectedItems', Array.from(selectedItems));
        form.setValue('unselectedItems', Array.from(unselectedItems));
    };
    function onSubmit(data: z.infer<typeof FormSchema>) {
        selectedItems.forEach(async (userId: string) => {
            if(userId)await updateOperatorAvailability(userId, true);
        });
        unselectedItems.forEach(async (userId: string) => {
            if(userId)await updateOperatorAvailability(userId, false);
        });
        setToast({ text: 'Changes Saved'})

    }
    const { onOpen } = useDisclosure();
    useEffect(() => {
        const fetchData = async () => {
            if (user?.publicMetadata.shopDomain) {
                const res = await getUsers(`${user.publicMetadata.shopDomain}`);
                setData(res);
                const initialSelected = new Set(res.filter(user => user.available).map(user => user.id));
                const initialUnselected = new Set(res.filter(user => !user.available).map(user => user.id));
                setSelectedItems(initialSelected);
                setUnselectedItems(initialUnselected);
                form.setValue('selectedItems', Array.from(initialSelected));
                form.setValue('unselectedItems', Array.from(initialUnselected));
            }
        }

        if (isLoaded) {
            fetchData();
        }
    }, [isLoaded, user, form]);
    return (
        <Popover placement="right"
            classNames={{
                base: "shadow-none",
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
            <PopoverContent className="p-1  shadow-none">
                <div className="flex flex-col gap-3 border border-stroke p-2 shadow text-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="selectedItems"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-1">
                                        </div>
                                        {data.map((user) => (
                                            <FormItem
                                                key={user.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={selectedItems.has(user.id)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(user.id, checked as boolean)}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {user.firstName} {user.lastName}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant="outline" className="p-1 pt-0 pb-0 m-0 text-xs w-full max-h-[30px] " type="submit">Save</Button>
                        </form>
                    </Form>
                </div>
            </PopoverContent>
        </Popover>
    )
}