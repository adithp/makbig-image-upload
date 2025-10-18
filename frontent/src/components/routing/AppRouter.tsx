import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/PocketBaseAuthContext';
import AuthPage from '../auth/AuthPage';
import PocketBaseStudentDashboard from '../dashboard/PocketBaseStudentDashboard';
import PocketBaseAdminDashboard from '../dashboard/PocketBaseAdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          currentUser ? (
            <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <AuthPage />
          )
        } 
      />
      
      <Route 
        path="/student" 
        element={
          <ProtectedRoute requiredRole="student">
            <PocketBaseStudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <PocketBaseAdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/unauthorized" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <Navigate to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/student') : '/auth'} replace />
        } 
      />
    </Routes>
  );
};

export default AppRouter;
