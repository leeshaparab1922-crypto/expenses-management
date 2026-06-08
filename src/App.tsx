import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
<<<<<<< HEAD
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
=======
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
>>>>>>> feature/stack-upgrade

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth()
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return <MainLayout>{children}</MainLayout>
}

const App: React.FC = () => {
  return (
    <AuthProvider>
<<<<<<< HEAD
      <CategoryProvider>
        <BudgetProvider>
          <TransactionProvider>
=======
      <ExpenseProvider>
        <BudgetProvider>
          <CategoryProvider>
>>>>>>> feature/stack-upgrade
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
<<<<<<< HEAD
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
=======
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
>>>>>>> feature/stack-upgrade
    </AuthProvider>
  )
}

export default App
