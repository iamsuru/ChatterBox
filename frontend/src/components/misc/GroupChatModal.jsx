import { Button, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { Form, FormGroup, Input } from 'reactstrap'
import { useState } from 'react';
import UserListItem from '../other/UserListItem';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../other/UserBadgeItem';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { fileDatabase } from '../../scripts/firebaseConfig'
import { BeatLoader } from 'react-spinners';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupName, setGroupName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false)
    const [groupPicture, setGroupPicture] = useState('https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png?w=128')
    const [groupProfilePicture, setGroupProfilePicture] = useState()

    const { chats, setChats, token } = ChatState();

    const toast = useToast()

    const setPicture = (e) => {
        setGroupPicture(URL.createObjectURL(e.target.files[0]))
        setGroupProfilePicture(e.target.files[0])
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
        } catch (error) {
            toast({
                title: error,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top-center'
            })
        }
    }

    const createGroup = async () => {
        setLoading2(true)
        if (!groupName) {
            toast({
                title: "Please fill required fields.",
                status: 'warning',
                duration: "2000",
                isClosable: false,
                position: 'top-center'
            })
            setLoading2(false)
            return;
        }
        if (selectedUsers.length === 0) {
            toast({
                title: "No user selected to add in the group.",
                status: 'warning',
                duration: "2000",
                isClosable: false,
                position: 'top-center'
            })
            setLoading2(false)
            return;
        }

        const profilePicturePath = ref(fileDatabase, `ProfilePicture/${groupName}/image`)

        await uploadBytes(profilePicturePath, groupProfilePicture)
            .then(async (snapshot) => {
                let profilePicture = await getDownloadURL(profilePicturePath)
                try {
                    const response = await fetch('/api/chat/create-group-chat', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: groupName, users: selectedUsers.map((u) => u._id), profilePicture })
                    });


                    const data = await response.json();

                    if (response.status === 200) {
                        toast({
                            title: 'Created Succesfully',
                            status: 'success',
                            duration: "2000",
                            isClosable: false,
                            position: 'top-center'
                        })
                        setGroupPicture()
                        setGroupProfilePicture()
                        setChats([data, ...chats])
                        setGroupName()
                        setSelectedUsers([])
                        setSearch()
                        setSearchResult([])
                        onClose();
                    }
                    else if (response.status === 400) {
                        toast({
                            title: data.message,
                            status: 'error',
                            duration: "2000",
                            isClosable: false,
                            position: 'top-center'
                        })
                    }
                    else {
                        toast({
                            title: data.message,
                            status: 'info',
                            duration: "2000",
                            isClosable: false,
                            position: 'top-center'
                        })
                    }
                    setLoading2(false)
                } catch (error) {
                    toast({
                        title: error,
                        status: 'error',
                        duration: "2000",
                        isClosable: false,
                        position: 'top-center'
                    })
                    setLoading2(false)
                }

            })
            .catch((error) => {
                toast({
                    title: 'Error Uploading File',
                    description: error.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setLoading(false)
            })




    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added.',
                status: 'warning',
                duration: "2000",
                isClosable: false,
                position: 'top-center'
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
        setSearchResult([])
        setSearch("")
        document.getElementById("searchField").value = ''
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >
                        Create a Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    >
                        <Form>
                            <div className='d-flex justify-content-center mb-3'>
                                <div
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        backgroundSize: 'contain',
                                        backgroundImage: `url(${groupPicture})`,
                                        backgroundRepeat: 'none',
                                        backgroundPosition: 'center',
                                        marginRight: '10px'
                                    }}
                                ></div>
                            </div>
                            <FormGroup>
                                <Stack direction='row' justifyContent='center' alignItems='center'
                                >
                                    <FormLabel fontWeight='bold' mt='2'>Picture</FormLabel>
                                    <Input
                                        autoComplete='off'
                                        type="file"
                                        onChange={(e) => setPicture(e)}
                                    />
                                </Stack>
                            </FormGroup>
                            <FormGroup>
                                <Input
                                    autoComplete='off'
                                    name="groupName"
                                    placeholder="Enter group name *"
                                    type="text"
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Input
                                    id='searchField'
                                    autoComplete='off'
                                    name="groupMembers"
                                    placeholder="Add users *"
                                    type="text"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormGroup>
                        </Form>

                        <div className='d-flex flex-wrap' style={{ width: "100%" }}>
                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={u._id} groupAdmin={null} creatingGroup={true} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </div>

                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            {loading ? <Spinner display="flex" justifyContent="center" /> : (
                                searchResult.length > 0 || searchResult !== null ? (searchResult?.slice(0, 4).map(user => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                ))
                                ) : <h6 className='mt-3'>No user found!</h6>
                            )}
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading={loading2} spinner={<BeatLoader size={7} color='white' />} backgroundColor="#ff628f" color="white" mr={3} onClick={createGroup} _hover={{ backgroundColor: "#ff628f" }}>
                            Done
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal