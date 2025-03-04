import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
// MAIN DASHBOARD
import Home from './components/box/Home'
import Login from './components/Login/Login'
import Signup from "./components/Login/Signup"
import Contact from './components/box/Contact'

// ADMIN
import Admin from "./components/Admin/Admin"
import Aasan from "./components/Admin/Aasan"


// USER 
import CompleteProfile from './components/User/CompleteProfile'
import User from './components/User/User'
import MyGroupsPage from './components/User/MyGroupsPage'
import ExploreAsanasPage from './components/User/ExploreAsanasPage'
import ChallengesPage from './components/User/ChallengesPage'
import Profile from './components/User/Profile'



function App() {
  return (
    <>
      <Routes>
        {/* MAIN DASHBOARD */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* ADMIN  */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-aasan" element={<Aasan />} />

        {/* USER  */}
        <Route path="/Complete-Profile" element={<CompleteProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<User />} />
        <Route path="/my-groups" element={<MyGroupsPage />} />
        <Route path="/explore-asanas" element={<ExploreAsanasPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />

        


        
      </Routes>
    </>
  )
}

export default App