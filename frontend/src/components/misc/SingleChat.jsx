import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Text, Box, Stack } from '@chakra-ui/layout'
import { Spinner, useToast, IconButton, Textarea } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroups from '../other/UpdateGroups'
import { getSender, getSenderDetails } from '../../scripts/ChatLogics'
import ProfileModal from '../nav/ProfileModal'
import ScrollableChat from '../other/ScrollableChat'
import Lottie from 'react-lottie'
import animationData from '../../animations/TypingAnimation.json'
import io from 'socket.io-client'
import { Form } from 'reactstrap'
const ENDPOINT = 'https://chatterbox-wy0q.onrender.com/'
// const ENDPOINT = 'http://localhost:2500'
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, token, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }


    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat;
    }, [selectedChat])


    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //notifications
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    }, [messages])//changes

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) {
            setNewMessage("");
            return;
        }
        if (newMessage.trim()) {
            socket.emit('stop typing', selectedChat._id)
            try {
                setNewMessage("")
                const response = await fetch('/api/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ message: newMessage, chatId: selectedChat._id })
                })

                const data = await response.json();

                if (response.status === 200) {
                    socket.emit('new message', data.message)
                    setFetchAgain(!fetchAgain)
                    setMessages([...messages, data.message])
                }
                else if (response.status === 404) {
                    toast({
                        title: data.message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                        position: 'top'
                    })
                }

            } catch (error) {
                toast({
                    title: error,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: 'top'
                })
            }
        }
    }


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true)
            const response = await fetch(`/api/message/${selectedChat._id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            const data = await response.json();

            if (response.status === 200) {
                setMessages(data.message)
                socket.emit('join chat', selectedChat._id)
            }
            else if (response.status === 404) {
                toast({
                    title: data.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: 'top'
                })
            }
            setLoading(false)
        } catch (error) {
            toast({
                title: error,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top'
            })
            setLoading(false)
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false);
            }
        }, timerLength)
    }




    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            paddingX={2}
                            width="100%"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                                _hover={{ background: "#ff628f", color: "white" }}
                            />
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderDetails(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    <h2>{selectedChat.chatName}</h2>
                                    <UpdateGroups
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    ></UpdateGroups>
                                </>
                            )}
                        </Text>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={3}
                            background="#ffffff50"
                            width="100%"
                            height="100%"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    width={20}
                                    height={20}
                                    alignSelf='center'
                                    margin='auto'
                                />
                            ) : (
                                <div
                                    style={{ display: "flex", flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}
                                >
                                    <ScrollableChat messages={messages} />
                                </div>
                            )
                            }

                            <Form mt={3} onSubmit={sendMessage}>
                                {isTyping ? <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={60}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div> : (<></>)}
                                <Stack direction='row' mt={3}>
                                    <Textarea
                                        variant='filled'
                                        resize='none'
                                        background="white"
                                        placeholder='Message'
                                        autoComplete='off'
                                        onChange={typingHandler}
                                        value={newMessage}
                                        minH='unset'
                                    />
                                    <IconButton backgroundColor='#ff628f' _hover={{ backgroundColor: "#ff628f" }} borderRadius='20px' color='#fff' type='submit'><i className="fa-regular fa-paper-plane"></i></IconButton>
                                </Stack>
                            </Form>
                        </Box>
                    </>
                ) : (
                    <div className='d-flex justify-content-center align-items-center vh-100 fw-bold'>
                        <h5 style={{ background: "#ffffff99", padding: "2px", borderRadius: '5px' }}>Select a chat to start messaging.</h5>
                    </div>
                )
            }
        </>
    )
}

export default SingleChat