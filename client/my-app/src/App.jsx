import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React, {lazy,Suspense} from 'react'


const Home = lazy(() => import('./components/usermanagement/Home'))
const Login = lazy(() => import('./components/usermanagement/Login'))
const Register = lazy(() => import('./components/usermanagement/Register'))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const ProtectedRoute = lazy(() => import('./components/usermanagement/ProtectedRoute'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
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
