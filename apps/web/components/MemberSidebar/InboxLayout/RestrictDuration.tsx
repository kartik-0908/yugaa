import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Switch } from "@nextui-org/react";

export default function RestrictDuration() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <button
                className="group relative flex items-center justify-center p-2 gap-2.5 py-2  rounded-md font-medium hover:bg-graydark dark:hover:bg-meta-4 "
                onClick={onOpen}>Restrict Duration</button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <p>
                                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )

}