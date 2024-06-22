import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'
const CurrentChat = ({ fetchAgain, setFetchAgain }) => {

    const { selectedChat } = ChatState()
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            padding={3}
            background="#00000020"
            width={{ base: "100%", md: "68.8%" }}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default CurrentChat