import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalBody>
                    <p>Really wanna delete <span className="font-semibold text-red-500">"{item?.length > 20 ? item?.substring(0, 20) + '...' : item}"</span> ?</p>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={onClose}>Cancel</Button>
                    <Button onPress={onConfirm} className="text-red-600">Delete</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteConfirmationModal; 