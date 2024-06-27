import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input as FileInput } from 'reactstrap'
import { useToast, Input, InputLeftElement, InputGroup, RadioGroup, Stack, Radio, FormLabel, Button } from '@chakra-ui/react'
import { AtSignIcon, EmailIcon, LockIcon } from '@chakra-ui/icons'
import PreviewImage from '../misc/PreviewImage'
import { BeatLoader } from 'react-spinners'

const RegistrationPage = () => {
    const navigate = useNavigate();
    const toast = useToast()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState();
    const [email_id, setEmail] = useState();
    const [gender, setGender] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState();
    const [picture, setPicture] = useState(null);

    const handleUsername = (e) => {
        const usernameValue = e.target.value;
        if (/\s/.test(usernameValue)) {
            const sanitizedValue = usernameValue.replace(/\s/g, '');
            setUsername(sanitizedValue);
        } else {
            setUsername(usernameValue);
        }
    }


    const createUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        document.getElementById("email").style.border = "none";
        document.getElementById("username").style.border = "none";

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email_id', email_id.trim().toLowerCase());
            formData.append('gender', gender);
            formData.append('username', username.trim().toLowerCase());
            formData.append('password', password);
            formData.append('file', picture);

            const response = await fetch("https://chatterbox-server-qa7d.onrender.com/api/user/register", {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.status === 201) {
                toast({
                    title: data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: false,
                    position: 'top'
                });
                setTimeout(() => {
                    navigate('/');
                }, 2500);
            } else if (response.status === 409 && data.message.includes('Email')) {
                toast({
                    title: data.message,
                    status: 'warning',
                    duration: 2000,
                    isClosable: false,
                    position: 'top'
                });
                document.getElementById("email").style.border = "3px solid red";
            } else if (response.status === 409 && data.message.includes('Username')) {
                toast({
                    title: data.message,
                    status: 'warning',
                    duration: 2000,
                    isClosable: false,
                    position: 'top'
                });
                document.getElementById("username").style.border = "3px solid red";
            } else if (response.status === 400) {
                toast({
                    title: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: false,
                    position: 'top'
                });
            }
            setLoading(false);
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration: 2000,
                isClosable: false,
                position: 'top'
            });
            setLoading(false);
        }
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
                    <div id='registration-form-container' className='flex-container'>
                        <div className='form-container'>

                            <div className='text-end me-4'>
                                <h6 className='h6-for-register'>Have an account?
                                    <Link to='/' className='link-to-register'> Sign in</Link>
                                </h6>
                            </div>

                            <div className='text-center mt-4'>
                                <h1 className='h1-heading'>Sign up to ChatterBox</h1>
                                <p className='p-msg'>Let's collect your information</p>
                            </div>

                            <Form onSubmit={createUser}>
                                <div className="row">
                                    <div className="col-md-6 mt-4">
                                        <InputGroup>
                                            <InputLeftElement pointerEvents='none'>
                                                <span className='fa fa-user'></span>
                                            </InputLeftElement>
                                            <Input type='text' placeholder='Enter Full Name' bg='white' required autoComplete='off' onChange={(e) => setName(e.target.value)} />
                                        </InputGroup>
                                    </div>
                                    <div className="col-md-6 mt-4">
                                        <InputGroup>
                                            <InputLeftElement pointerEvents='none'>
                                                <EmailIcon />
                                            </InputLeftElement>
                                            <Input type='email' id='email' placeholder='Enter Email Address' bg='white' required autoComplete='off' onChange={(e) => setEmail(e.target.value)} />
                                        </InputGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mt-4">
                                        <InputGroup>
                                            <InputLeftElement pointerEvents='none'>
                                                <AtSignIcon />
                                            </InputLeftElement>
                                            <Input type='text' id='username'
                                                value={username} placeholder='Create Username' bg='white' required autoComplete='off' onChange={(e) => handleUsername(e)} />
                                        </InputGroup>
                                    </div>
                                    <div className="col-md-6 mt-4">
                                        <InputGroup>
                                            <InputLeftElement pointerEvents='none'>
                                                <LockIcon />
                                            </InputLeftElement>
                                            <Input type='password' placeholder='Create Password' bg='white' required autoComplete='off' onChange={(e) => setPassword(e.target.value)} />
                                        </InputGroup>
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <Stack direction='row'>
                                        <FormLabel me={130}>Gender</FormLabel>
                                        <RadioGroup onChange={setGender}>
                                            <Stack direction='row' spacing={3}>
                                                <Radio colorScheme='radioColor' value='Male'>He</Radio>
                                                <Radio colorScheme='radioColor' value='Female'>She</Radio>
                                                <Radio colorScheme='radioColor' value='Other'>Other</Radio>
                                            </Stack>
                                        </RadioGroup>
                                    </Stack>
                                </div>

                                <div className="mt-4" style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="profilePicture" className="form-label" style={{ marginRight: '1rem' }}>Profile Picture</label>
                                    <div className='ms-5'>
                                        <FileInput type="file" accept="image/*" id="profilePicture" onChange={(e) => setPicture(e.target.files[0])} />
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <Button isLoading={loading} spinner={<BeatLoader size={7} color='white' />} type='submit' className='submitBtn' width='100%' height='40px'
                                    >SIGN UP NOW!</Button>
                                </div>

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

export default RegistrationPage