import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";


const CustomModal = ({ isOpen, onClose, size, title = "Modal Title", body, footer, className = "", contentClassName = "", headerClassName = "", placement }) => {

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} size={size || "xl"} placement={placement || "center"} className={className}>
            <ModalContent className={`max-h-[90vh] overflow-y-auto ${contentClassName}`}>
                <ModalHeader className={`flex flex-col gap-1 border-b ${headerClassName}`}>{title}</ModalHeader>
                <ModalBody className="overflow-y-auto">
                    {body}
                </ModalBody>
                <ModalFooter>
                    {footer}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default CustomModal;
