import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
} from "@heroui/react";

export default function CustomDrawer({ placement = "right", isOpen, children, title, onClose, withFooter = false }) {
    return (
        <Drawer isOpen={isOpen} onOpenChange={onClose} placement={placement} backdrop="blur"
        >
            <DrawerContent>
                <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>
                <DrawerBody className="overflow-y-auto">
                    {children}
                </DrawerBody>
                {withFooter &&
                    <DrawerFooter>
                        <Button onPress={onClose} color="danger" variant="flat">Close</Button>
                    </DrawerFooter>
                }
            </DrawerContent>
        </Drawer>
    );
}

