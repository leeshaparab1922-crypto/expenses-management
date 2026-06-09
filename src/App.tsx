import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ExpenseProvider } from './contexts/ExpenseContext'
import { BudgetProvider } from './contexts/BudgetContext'
import { CategoryProvider } from './contexts/CategoryContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './components/Layout/MainLayout'
import Budget from './pages/Budget'
import Categories from './pages/Categories'
import History from './pages/History'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Transaction from './pages/Transaction'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, authLoading } = useAuth()
  if (authLoading) return null
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return <MainLayout>{children}</MainLayout>
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <CategoryProvider>
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
                <Route
                  path="/budget"
                  element={
                    <ProtectedRoute>
                      <Budget />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <Categories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transaction"
                  element={
                    <ProtectedRoute>
                      <Transaction />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Router>
          </CategoryProvider>
        </BudgetProvider>
      </ExpenseProvider>
    </AuthProvider>
  )
}

export default App
