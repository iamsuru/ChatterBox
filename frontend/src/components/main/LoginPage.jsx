import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form } from 'reactstrap'
import { useToast, Input, InputLeftElement, Stack, InputGroup, Button } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import PreviewImage from '../misc/PreviewImage'
import { BeatLoader } from 'react-spinners';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const navigate = useNavigate();

    const authenticateUser = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const response = await fetch("https://chatterbox-server-qa7d.onrender.com/api/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: identifier.trim().toLowerCase(), password })
            })


            const data = await response.json();

            if (response.status === 200) {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })

                localStorage.setItem('currentUserToken', JSON.stringify(data.token))
                localStorage.setItem('currentUser', JSON.stringify(data.auth))

                setTimeout(() => {
                    navigate('/home-page-chat-section')
                }, 2000)

            } else if (response.status === 404) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            } else if (response.status === 401) {
                toast({
                    title: data.message,
                    status: 'warning',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            } else if (response.status === 500) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
            }
            setLoading(false)
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: "2000",
                isClosable: false,
                position: 'top'
            })
            setLoading(false)
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <div id='login-form-container' className='flex-container'>
                        <div className='form-container'>

                            <div className='text-end'>
                                <h6 className='h6-for-register'>Not a member?
                                    <Link to='/create-an-account' className='a-to-register'> Register now</Link>
                                </h6>
                            </div>

                            <div className='text-center mt-4'>
                                <h1 className='h1-heading'>Hello Again!</h1>
                                <p className='p-msg'>Welcome back you've been missed!</p>
                            </div>

                            <Form onSubmit={authenticateUser}>
                                <Stack spacing={4}>
                                    <InputGroup mt={5}>
                                        <InputLeftElement pointerEvents='none' mt={1.5}>
                                            <span className='fa fa-user'></span>
                                        </InputLeftElement>
                                        <Input height='45px' type='text' placeholder='Email or Username' bg='white' required autoComplete='off' onChange={(e) => setIdentifier(e.target.value)} />
                                    </InputGroup>

                                    <InputGroup mt={4}>
                                        <InputLeftElement pointerEvents='none' mt={1.5}>
                                            <LockIcon />
                                        </InputLeftElement>
                                        <Input height='45px' type='password' bg='white' placeholder='Password' required autoComplete='off'
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </InputGroup>
                                    <Link to='/recover-password' className='mt-2 mb-2 text-end a-for-recover-pass'>Recover Password</Link>
                                    <div>
                                        <Button isLoading={loading} spinner={<BeatLoader size={7} color='white' />} type='submit' className='submitBtn' width='100%' height='40px'
                                        >Let me in</Button>
                                    </div>
                                </Stack>
                            </Form>

                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <PreviewImage />
                </div>
            </div>
        </div>
    )
}

export default LoginPage