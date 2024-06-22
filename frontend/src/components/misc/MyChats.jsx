import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useToast, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../other/ChatLoading';
import { Stack } from '@chakra-ui/react';
import { getSender, getSenderDetails, getSenderProfilePicture } from '../../scripts/ChatLogics';
import GroupChatModal from './GroupChatModal';
import ProfileModal from '../nav/ProfileModal';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, chats, setChats, token } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try {
            const response = await fetch('/api/chat/fetch-chat', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                setChats(data.message);
            } else if (response.status === 400) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: '2000',
                    isClosable: false,
                    position: 'top-center',
                });
            }
        } catch (error) {
            toast({
                title: error,
                status: 'error',
                duration: '2000',
                isClosable: false,
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('currentUser')));
        fetchChats();
    }, [fetchAgain]);

    const truncateMessage = (message) => {
        if (!message) return '';
        if (message.length > 50) {
            return message.slice(0, 15) + '...';
        }
        return message;
    };



    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir="column"
            alignItems="center"
            padding={3}
            background="#00000020"
            width={{ base: '100%', md: '31%' }}
        >
            <Box
                paddingBottom={3}
                paddingX={3}
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                <h2>Messages</h2>
                <GroupChatModal>
                    <Button
                        display="flex"
                        rightIcon={<AddIcon />}
                        backgroundColor="#ff628f"
                        color="white"
                        _hover={{ background: '#7b33ff' }}
                    >
                        <>Create New Group</>
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                padding={2.5}
                background="#ffffff50"
                width="100%"
                height="100%"
                borderRadius="3px"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                cursor="pointer"
                                background={selectedChat === chat ? '#ff628f' : '#e8e8e8'}
                                color={selectedChat === chat ? 'white' : 'black'}
                                px={3}
                                py={3}
                                borderRadius="3px"
                                key={chat._id}
                                _hover={{ backgroundColor: '#ff628f', color: 'white' }}
                            >
                                <div>
                                    {!chat.isGroupChat ? (
                                        <Stack direction="row">
                                            <ProfileModal user={getSenderDetails(loggedUser, chat.users)}>
                                                <div
                                                    style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '50%',
                                                        backgroundSize: 'contain',
                                                        backgroundImage: `url(${getSenderProfilePicture(loggedUser, chat.users)})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center',
                                                        marginRight: '10px'
                                                    }}
                                                ></div>
                                            </ProfileModal>
                                            <div style={{ width: '100%', height: '5vh' }}
                                                onClick={() => setSelectedChat(chat)}>
                                                <div className="fw-bold">
                                                    {getSender(loggedUser, chat.users) === loggedUser?.username
                                                        ? 'You'
                                                        : getSender(loggedUser, chat.users)}
                                                </div>

                                                <span>
                                                    {truncateMessage(chat.latestMessage?.message)}
                                                </span>
                                            </div>
                                        </Stack>
                                    ) : (
                                        <Stack direction="row">
                                            <ProfileModal name={chat.chatName} groupIcon={chat?.profilePicture}>
                                                <div
                                                    style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '50%',
                                                        backgroundSize: 'contain',
                                                        backgroundImage: `url(${chat?.profilePicture})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center',
                                                        marginRight: '10px'
                                                    }}
                                                ></div>
                                            </ProfileModal>
                                            {chat.chatName}
                                            <div style={{ width: '100%', height: '5vh' }}
                                                onClick={() => setSelectedChat(chat)}>
                                                <div className="fw-bold">{chat.chatName}</div>

                                                <span>
                                                    {chat.latestMessage?.sender && chat.latestMessage?.sender._id === loggedUser._id
                                                        ? 'You'
                                                        : chat.latestMessage?.sender?.username || ''}
                                                    {chat.latestMessage ? <>&nbsp;:&nbsp;</> : null}
                                                    {truncateMessage(chat.latestMessage?.message)}
                                                </span>
                                            </div>
                                        </Stack>
                                    )}
                                </div>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>

        </Box>
    );
};

export default MyChats;