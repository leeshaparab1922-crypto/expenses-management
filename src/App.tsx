import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ExpenseProvider } from './contexts/ExpenseContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth()
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  )
}

export default App
