import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onButtonPressed: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  onButtonPressed,
  isOpen,
  onOpenChange,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Records
              </ModalHeader>
              <ModalBody>
                <p>Do you want to delete the records?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onButtonPressed();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
