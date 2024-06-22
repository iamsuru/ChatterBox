import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/layout';
import MyChats from '../misc/MyChats';
import CurrentChat from '../misc/CurrentChat';

const Homepage = () => {

    const { token } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)
    return (
        <div style={{ width: "100%" }}>
            <Box
                display='flex'
                justifyContent='space-between'
                width="100%"
                height='90vh'
            >
                {token && <MyChats fetchAgain={fetchAgain} />}
                {token && <CurrentChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default Homepage