"use client"
import { RangeCalendar } from "@nextui-org/calendar";
import { today, getLocalTimeZone, parseDate, CalendarDate } from '@internationalized/date';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

export default function Filter() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const router = useRouter()
    let [value, setValue] = React.useState({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).subtract({ weeks: 1 }),
    });
    function handlechange(value: any) {
        setValue(value);
        // console.log(value.start)
        const { start } = value
        const { end } = value
        console.log(getLocalTimeZone())
        onClose()
        router.push(`/admin/analytics?startYear=${start.year}&startMonth=${start.month}&startDay=${start.day}&endYear=${end.year}&endMonth=${end.month}&endDay=${end.day}`);
    }
    return (
        <div className="grid grid-cols-12">
            <div className="col-span-12 p-6 pt-0 text-center relative flex justify-center">
                <Button
                    onPress={onOpen}
                    className="mb-3 text-center block text-sm font-medium text-black dark:text-white"
                >
                    Choose Date Range
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl"
                    classNames={{
                        base: "bg-null shadow-none",
                        wrapper: "shadow-none",
                        closeButton: "bg-black z-99999"
                    }}
                >
                    <ModalContent>
                        <ModalBody>
                            <RangeCalendar
                                aria-label="Date (Uncontrolled)"
                                maxValue={today(getLocalTimeZone())}
                                // defaultValue={{
                                //   start: parseDate(adjustedStartDate.toISOString().split('T')[0]),
                                //   end: parseDate(adjustedEndDate.toISOString().split('T')[0]),
                                // }}
                                value={value}

                                visibleMonths={3}
                                pageBehavior="single"
                                onChange={handlechange}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}