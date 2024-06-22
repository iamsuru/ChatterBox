import React from 'react'
import './App.css'
import RegistrationPage from './components/main/RegistrationPage'
import LoginPage from './components/main/LoginPage'
import { Routes, Route } from 'react-router-dom'
import Homepage from './components/main/Homepage'
import NavBar from './components/nav/NavBar'
import RecoverPasswordPage from './components/main/RecoverPasswordPage'
import ServerChanged from './components/other/ServerChanged'


const host = window.location.origin

const App = () => {
  return (
    <>
      {host === "https://web-chatterbox.netlify.app"
        ?
        <>
          <NavBar />
          <Routes>
            <Route exact path='/' element={<LoginPage />} />
            <Route path='/create-an-account' element={<RegistrationPage />} />
            <Route path='/home-page-chat-section' element={<Homepage />} />
            <Route path='/recover-password' element={<RecoverPasswordPage />} />
          </Routes>
        </>
        :
        <>
          <ServerChanged />
        </>
      }
    </>
  )
}

export default App