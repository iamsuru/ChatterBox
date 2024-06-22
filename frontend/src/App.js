import React from 'react'
import './App.css'
import RegistrationPage from './components/main/RegistrationPage'
import LoginPage from './components/main/LoginPage'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/main/Homepage'
import NavBar from './components/nav/NavBar'
import RecoverPasswordPage from './components/main/RecoverPasswordPage'


const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path='/' element={<LoginPage />} />
        <Route path='/create-an-account' element={<RegistrationPage />} />
        <Route path='/home-page-chat-section' element={<Homepage />} />
        <Route path='/recover-password' element={<RecoverPasswordPage />} />
      </Routes>
    </>
  )
}

export default App