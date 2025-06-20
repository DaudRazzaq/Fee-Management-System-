import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';  // Import the SignUp component
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import PaymentList from './pages/PaymentList';
import AddPayment from './pages/AddPayment';
import FeeStructure from './pages/FeeStructure';
import Reports from './pages/Reports';

// CSS
import './styles/globals.css';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f1f5f9'
      }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />  {/* Add SignUp route */}
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Student routes */}
          <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
          <Route path="/students/add" element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
          
          {/* Payment routes */}
          <Route path="/payments" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} />
          <Route path="/payments/add" element={<ProtectedRoute><AddPayment /></ProtectedRoute>} />
          
          {/* Fee structure route */}
          <Route path="/fee-structure" element={<ProtectedRoute><FeeStructure /></ProtectedRoute>} />
          
          {/* Reports route */}
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;