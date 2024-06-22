import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, useToast, useDisclosure } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import UserListItem from '../other/UserListItem';
import ChatLoading from '../other/ChatLoading';
import { useState } from 'react';
import { NavbarBrand } from 'reactstrap'
import NavBarBrandImageUrl from '../../images/brand-logo.png';
import { getSender } from '../../scripts/ChatLogics';
import NotificationBadge, { Effect } from 'react-notification-badge';

const NavBar = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, token, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const navigate = useNavigate();
    const toast = useToast();

    const handleSearchInputChange = (event) => {
        setSearch(event.target.value);
        if (search.length > 1) {
            searchUser(search);
        }
    };

    const searchUser = async () => {
        if (!search) {
            toast({
                title: "Field can't be empty",
                status: "warning",
                duration: 3000,
                isCloseable: true,
                position: 'top-right'
            });
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`https://chatterbox-server-qa7d.onrender.com/api/user/search-user?search=${search}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: error,
                status: "warning",
                duration: 3000,
                isCloseable: true,
                position: 'top-right'
            });
        }
    };

    const accessChat = async (userId) => {
        setSearch("");
        setSearchResult([]);
        try {
            setLoadingChat(true);
            const response = await fetch('https://chatterbox-server-qa7d.onrender.com/api/chat/access-chat', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });

            const data = await response.json();

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            if (response.status === 200) {
                setSelectedChat(data);
                setTimeout(() => {
                    setLoadingChat(false);
                    onClose();
                }, 2000);
            } else if (response.status === 400) {
                toast({
                    title: data.message,
                    status: "error",
                    duration: 3000,
                    isCloseable: true,
                    position: 'top-center'
                });
            }
        } catch (error) {
            toast({
                title: error,
                status: "error",
                duration: 3000,
                isCloseable: true,
                position: 'top-center'
            });
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserToken');
        navigate('/');
    };

    return (
        <>
            <Box
                display='flex'
                justifyContent="space-between"
                alignItems="center"
                bg="#00000070"
                width="100%"
                padding="5px 10px 5px 10px"
            >
                <NavbarBrand className='ms-4'>
                    <img alt='ChatterBox' src={NavBarBrandImageUrl} style={{ height: "8vh", width: "100%" }} />
                </NavbarBrand>
                <div className='ms-auto'>
                    {token && (
                        <div className='me-4'>
                            <Button variant="ghost" color='white' _hover={{ color: 'black', backgroundColor: "white" }} onClick={onOpen}>
                                <i className='fas fa-search'></i>
                                <Text display={{ base: "none", sm: "flex" }} marginTop="10px" marginLeft="5px" px={3} mt={3.5}>Search User</Text>
                            </Button>


                            <Menu>
                                <MenuButton padding={1} me={3}>
                                    <NotificationBadge count={notification.length} effect={Effect.ROTATE_X} />
                                    <BellIcon fontSize="2xl" color='white' me={3} />
                                </MenuButton>
                                <MenuList pl={3}>
                                    {!notification.length && <div className=''>No new messages</div>}
                                    {notification.map(notif => (
                                        <MenuItem key={notif._id} me={2} pe={5} onClick={() => {
                                            setSelectedChat(notif.chat)
                                            setNotification(notification.filter((n) => n !== notif))
                                        }}>
                                            {notif.chat.isGroupChat ? <>
                                                <span>New message in&nbsp;</span>
                                                <span><strong>{notif.chat.chatName}</strong></span>
                                            </> : (
                                                <>
                                                    <span>New message from&nbsp;</span>
                                                    <span><strong>{getSender(user, notif.chat.users)}</strong></span>
                                                </>
                                            )}

                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>

                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    <div
                                        style={{
                                            width: '27px',
                                            height: '27px',
                                            borderRadius: '50%',
                                            backgroundSize: 'contain',
                                            backgroundImage: `url(${user?.profilePicture})`,
                                            backgroundRepeat: 'none',
                                            backgroundPosition: 'center'
                                        }}
                                    ></div>
                                </MenuButton>

                                <MenuList>
                                    <ProfileModal user={user}>
                                        <MenuItem>My Profile</MenuItem>
                                    </ProfileModal>
                                    <MenuDivider />
                                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    )}
                </div>
            </Box>


            <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Add your friends</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex">
                            <Input
                                placeholder='Start typing to search'
                                value={search}
                                onChange={handleSearchInputChange}
                                style={{ marginBottom: "10px" }}
                            />
                            <Button style={{ backgroundColor: "#ff628f", color: "white", marginLeft: "10px" }} onClick={searchUser}>Search</Button>
                        </Box>
                        {loading ? (<ChatLoading />) :
                            (
                                searchResult.length > 0 ? (
                                    searchResult.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                ) :
                                    search.length > 0 && //Display "No user found" only if there was a search
                                    <span><h6 className='mt-3 ms-2'>No user found!</h6></span>
                            )}
                        {loadingChat && <>
                            <div className='d-flex justify-content-center mt-3' >
                                <Spinner size="lg" />
                            </div>
                        </>}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default NavBar;