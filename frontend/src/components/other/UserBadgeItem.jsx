import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import React from 'react'

const UserBadgeItem = ({ user, groupAdmin, handleFunction, creatingGroup }) => {
    let isGroupAdmin = false;
    if (groupAdmin) {
        isGroupAdmin = groupAdmin.groupAdmin._id === user._id;
    }
    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            fontSize={12}
            backgroundColor="#7b33ff"
            color="white"
            cursor='pointer'
            onClick={handleFunction}
        >
            {user.username} {isGroupAdmin && <i style={{ fontSize: "100%", paddingLeft: '2px', paddingRight: '2px', color: '#fff' }} className="fa-solid fa-user-tie"></i>}
            <CloseIcon pl={1} />
        </Box>
    )
}

export default UserBadgeItem
