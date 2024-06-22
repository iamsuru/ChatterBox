import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { getSenderDetails, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../scripts/ChatLogics'
import { Tooltip } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from '../nav/ProfileModal'

const ScrollableChat = ({ messages }) => {
    const { user, selectedChat } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((msg, idx) => (
                <div className='d-flex' key={msg._id}>
                    {
                        (isSameSender(messages, msg, idx, user._id)
                            || isLastMessage(messages, idx, user._id)
                        ) && (
                            <Tooltip
                                label={msg.sender.name}
                                placement='bottom-start'
                                hasArrow
                            >
                                <ProfileModal user={getSenderDetails(user, selectedChat.users)}>
                                    <div
                                        className='me-1'
                                        style={{
                                            width: '27px',
                                            height: '27px',
                                            borderRadius: '50%',
                                            backgroundSize: 'contain',
                                            backgroundImage: `url(${msg.sender.profilePicture})`,
                                            backgroundRepeat: 'none',
                                            backgroundPosition: 'center',
                                            marginTop: '11px',
                                            marginBottom: '2px',
                                            cursor: 'pointer'
                                        }}
                                    ></div>
                                </ProfileModal>
                            </Tooltip>
                        )
                    }
                    <span
                        style={{
                            color: 'white',
                            backgroundColor: `${msg.sender._id === user._id ? "#7b33ff" : "#ff628f"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, msg, idx, user._id),
                            marginTop: isSameUser(messages, msg, idx, user._id) ? 3 : 10
                        }}
                    >
                        {msg.message}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat