import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { CategoryProvider } from './contexts/CategoryContext'
import { BudgetProvider } from './contexts/BudgetContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import TransactionPage from './pages/Transaction'
import Budget from './pages/Budget'
import Categories from './pages/Categories'
import Reports from './pages/Reports'
import Profile from './pages/Profile'

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
      <CategoryProvider>
        <BudgetProvider>
          <TransactionProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="history" element={<History />} />
                        <Route path="transaction" element={<TransactionPage />} />
                        <Route path="budget" element={<Budget />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </TransactionProvider>
        </BudgetProvider>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
