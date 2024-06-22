import React, { useState } from 'react'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';
import { ChatState } from '../../context/ChatProvider';

const UpdateGroups = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast()

    const [groupName, setGroupName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat, user, token } = ChatState();

    //remove user from group
    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only admin has the rights to remove!",
                status: 'info',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/chat/remove-individual-from-group`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId: selectedChat._id, userId: userToRemove._id })
            })

            const data = await response.json();


            if (response.status === 200) {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data.removed)
                setFetchAgain(!fetchAgain)
                fetchMessages()
                setLoading(false)
            }
            else if (response.status === 404) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setLoading(false)
            }

        } catch (error) {
            toast({
                title: error,
                status: 'success',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            setLoading(false)
        }
    }

    const renameGroup = async () => {
        if (!groupName) {
            toast({
                title: `Group name can't be empty!`,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            return;
        }
        try {
            setRenameLoading(true)

            const response = await fetch('/api/chat/rename-group-chat', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId: selectedChat._id, chatName: groupName })
            });


            const data = await response.json();

            if (response.status === 200) {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setSelectedChat(data.updatedChat)
                setFetchAgain(!fetchAgain)
                setRenameLoading(false)
            }
            else if (response.status === 404) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            }
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: error,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            setRenameLoading(false)
        }
        setGroupName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }

        try {
            setLoading(true)
            const response = await fetch(`/api/user/search-user?search=${search}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();

            setLoading(false)
            setSearchResult(data)
            console.log(data);
        } catch (error) {
            toast({
                title: error,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
        }
    }

    const handleAddUserToGroup = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: 'User already in the group!',
                status: 'warning',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin has the rights to add!',
                status: 'info',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/chat/add-individual-to-group', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId: selectedChat._id, userId: userToAdd._id })
            })

            const data = await response.json();

            if (response.status === 200) {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setLoading(false)
            }
            else if (response.status === 404) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setLoading(false)
            }
            setSelectedChat(data.added);
            setFetchAgain(!fetchAgain)
            setSearch('')
            setSearchResult([])

        } catch (error) {
            toast({
                title: error,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            setLoading(false)
        }

    }

    return (
        <>
            <IconButton display={{ base: "flex" }} onClick={onOpen}><i className="fa-solid fa-ellipsis-vertical"></i></IconButton>
            <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="20px"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box
                            width="100%"
                            display="flex"
                            flexWrap="wrap"
                            pb={3}
                        >
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={user._id}
                                    groupAdmin={selectedChat}
                                    user={u}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>

                        <FormControl display="flex">
                            <Input
                                placeholder='Enter new group name'
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            ></Input>
                            <Button
                                variant="solid"
                                background="#ff628f"
                                _hover="#fff628f"
                                color="white"
                                ml={2}
                                isLoading={renameLoading}
                                onClick={renameGroup}
                            >
                                Rename
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                autoComplete='off'
                                mt={5}
                                name="groupMembers"
                                placeholder="Add users *"
                                type="text"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>


                        {loading ? (
                            <Spinner m={3} size="lg" />
                        ) :
                            (
                                searchResult?.slice(0, 4).map((u) => (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleAddUserToGroup(u)}
                                    />
                                ))
                            )}

                    </ModalBody>
                    <ModalFooter>
                        <Button backgroundColor='#cc1d3a' _hover="#cc1d3a" color="white" mr={3} onClick={() => handleRemove(user)}>
                            Exit Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroups