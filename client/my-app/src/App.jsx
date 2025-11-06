import { useState } from 'react'
import {BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import React, {lazy,Suspense} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Home = lazy(() => import('./components/usermanagement/Home'))
const Login = lazy(() => import('./components/usermanagement/Login'))
const Register = lazy(() => import('./components/usermanagement/Register'))
const Dashboard = lazy(() => import('./components/transactions/Dashboard'))
const ProtectedRoute = lazy(() => import('./components/usermanagement/ProtectedRoute'))
const Analytics = lazy(() => import('./components/analytics/Analytics'))
const Logout = lazy(() => import('./components/usermanagement/Logout'))


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className = "text-center p-5">Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />
          <Route path = '/analytics' element = {
            <ProtectedRoute>
              <Analytics />
              </ProtectedRoute> }/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
        
      </Suspense>
    </BrowserRouter>
  )
}

export default App
