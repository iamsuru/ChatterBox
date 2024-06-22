import React from 'react';
import { Box } from '@chakra-ui/layout';

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor='pointer'
            backgroundColor="#e8e8e8"
            _hover={{
                backgroundColor: "#ff628f",
                color: "white"
            }}
            width="100%"
            display="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mt={2}
            borderRadius="lg"
        >
            <div
                style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundSize: 'contain',
                    backgroundImage: `url(${user.profilePicture})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    marginRight: '10px',
                    cursor: 'pointer'
                }}
                className='ms-3 me-2'
            ></div>
            <Box marginLeft="10px">
                <h6 style={{ fontWeight: 'bold' }}>{user.username}</h6>
                <span style={{ fontWeight: '300' }}>{user.name}</span>
            </Box>
        </Box>
    );
};

export default UserListItem;
