import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import Signup from "./components/Login/Signup"
import Home from './components/box/Home'
import MyGroupsPage from './components/User/MyGroupsPage'
import ExploreAsanasPage from './components/User/ExploreAsanasPage'
import ChallengesPage from './components/User/ChallengesPage'
import User from './components/User/User'
import CompleteProfile from './components/User/CompleteProfile'
import Profile from './components/User/Profile'
import Admin from "./components/Admin/Admin"
import Group from"./components/Admin/Group"
import Aasan from "./components/Admin/Aasan"
import Challenges from "./components/Admin/Challenges"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Complete-Profile" element={<CompleteProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-group" element={<Group />} />
        <Route path="/add-aasan" element={<Aasan />} />
        <Route path="/add-challenges" element={<Challenges />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<User />} />
        <Route path="/my-groups" element={<MyGroupsPage />} />
        <Route path="/explore-asanas" element={<ExploreAsanasPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App