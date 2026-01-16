import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import LeftNav from './components/LeftNav'
import Hero from './components/Hero'
import Features from './components/Features'
import CTA from './components/CTA'
import MainCarousel from './components/MainCarousel'
import Footer from './components/Footer'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TransferPage from './pages/TransferPage'
import InformationPage from './pages/InformationPage'
import AccountsPage from './pages/AccountsPage'
import MovementsPage from './pages/MovementsPage'
import ContactsPage from './pages/ContactsPage'

function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={
        <main>
          <MainCarousel />
          <Hero />
          <Features />
          <CTA />
        </main>
      } />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transfer" element={<TransferPage />} />
      <Route path='/info' element={<InformationPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/movements" element={<MovementsPage />} />
      <Route path="/contact" element={<ContactsPage/> } />
    </Routes>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <AppBody />
      <Footer />
    </BrowserRouter>
  )
}

function AppBody(){
  const location = useLocation()
  const publicPaths = ['/', '/register', '/login', '/info']
  const protectedRoute = !publicPaths.includes(location.pathname)

  if(protectedRoute){
    return (
      <div className="page-with-leftnav">
        <LeftNav />
        <main className="content-area app-content">
          <AppRoutes />
        </main>
      </div>
    )
  }

  return (
    <div className="app-content">
      <AppRoutes />
    </div>
  )
}
