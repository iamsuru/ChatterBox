import React from 'react'
import image from '../../images/preview_image.png'
import { Box, Image } from '@chakra-ui/react'
const PreviewImage = () => {
    return (
        <Box display='flex' id='previewImage' justifyContent='center' alignItems='center' height='90vh'>
            <Image src={image} />
        </Box>
    )
}

export default PreviewImage