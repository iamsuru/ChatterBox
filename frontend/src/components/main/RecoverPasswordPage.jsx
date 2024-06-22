import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form } from 'reactstrap'
import { useToast, Input, InputLeftElement, InputGroup, Stack, Button } from '@chakra-ui/react'
import { LockIcon } from '@chakra-ui/icons'
import PreviewImage from '../misc/PreviewImage'
import { BeatLoader } from 'react-spinners'

const RecoverPasswordPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const navigate = useNavigate();

    const recoverUserPassword = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (password === confirmPassword) {
            try {
                const response = await fetch("/api/user/recover-password", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email_id: identifier.trim(), password })
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
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)

                } else if (response.status === 404) {
                    toast({
                        title: data.message,
                        status: 'error',
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
                    title: error,
                    status: 'error',
                    duration: "2000",
                    isClosable: false,
                    position: 'top'
                })
                setLoading(false)
            }
        } else {
            toast({
                title: 'Passwords are not same.',
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
                    <div id='registration-form-container' className='flex-container'>
                        <div className='form-container'>

                            <div className='text-center mt-4'>
                                <h1 className='h1-heading'>Recover Password</h1>
                                <p className='p-msg'>Don't worry we'll fix this.</p>
                            </div>
                            <Form onSubmit={recoverUserPassword}>
                                <Stack spacing={4}>
                                    <InputGroup mt={5}>
                                        <InputLeftElement pointerEvents='none' mt={1.5}>
                                            <span className='fa fa-user'></span>
                                        </InputLeftElement>
                                        <Input height='45px' type='text' placeholder='Email' bg='white' required autoComplete='off' onChange={(e) => setIdentifier(e.target.value)} />
                                    </InputGroup>

                                    <InputGroup mt={4}>
                                        <InputLeftElement pointerEvents='none' mt={1.5}>
                                            <LockIcon />
                                        </InputLeftElement>
                                        <Input height='45px' type='password' bg='white' placeholder='New password' required autoComplete='off'
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </InputGroup>

                                    <InputGroup mt={4}>
                                        <InputLeftElement pointerEvents='none' mt={1.5}>
                                            <LockIcon />
                                        </InputLeftElement>
                                        <Input height='45px' type='password' bg='white' placeholder='Confirm new password' required autoComplete='off'
                                            onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </InputGroup>


                                    <div className='mt-4'>
                                        <Button isLoading={loading} spinner={<BeatLoader size={7} color='white' />} type='submit' className='submitBtn' width='100%' height='40px'
                                        >Update Password</Button>
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

export default RecoverPasswordPage