import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [token, setToken] = useState()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [notification, setNotification] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        const isTokenExpired = async (toCheck) => {
            try {
                const response = await fetch('https://chatterbox-server-qa7d.onrender.com/api/user/isTokenExpired', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: toCheck }),
                });

                const data = await response.json()
                if (response.status === 200) {
                    navigate('/home-page-chat-section')
                }
                else if (response.status === 410) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('currentUserToken');
                    setUser("")
                    setToken("")
                    navigate('/');
                } else if (response.status === 500) {
                    console.log('Internal server error ' + data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        setUser(currentUser)

        const currentUserToken = JSON.parse(localStorage.getItem('currentUserToken'))
        setToken(currentUserToken)

        if (currentUserToken) {
            isTokenExpired(currentUserToken)
        }
        if (!currentUser && window.location.pathname === '/home-page-chat-section') {
            navigate('/')
        }
    }, [navigate])

    return (
        <ChatContext.Provider value={{ user, setUser, token, chats, setChats, selectedChat, setSelectedChat, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => { return useContext(ChatContext) }

export default ChatProvider