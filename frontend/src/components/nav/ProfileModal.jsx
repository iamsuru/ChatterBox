import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children, name, groupIcon }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} onClick={onOpen} ><i className="fa-solid fa-ellipsis-vertical"></i></IconButton>
            )}

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="20px" display="flex" justifyContent="center">
                        {!name && <>
                            @{user?.username}
                        </>}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center" marginBottom='20px'>
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                backgroundSize: 'contain',
                                backgroundImage: groupIcon ? `url(${groupIcon})` : `url(${user.profilePicture})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: 'center',
                                marginBottom: "13px"
                            }}
                        >
                        </div>

                        {name ?
                            (
                                <h4>Group Name : {name}</h4>
                            ) : (
                                <h4>Name: {user?.name}</h4>
                            )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
