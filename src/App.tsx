import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import CreateChatbot from './components/CreateChatbot';
import KnowledgeBase from './components/KnowledgeBase';
import ChatbotConfig from './components/ChatbotConfig';
import ChatPreview from './components/ChatPreview';
import Deployment from './components/Deployment';
import Analytics from './components/Analytics';
import ConversationHistory from './components/ConversationHistory';
import Settings from './components/Settings';
import Profile from './components/Profile';

function AppRoutes() {
  const { user, isInitialized } = useAuth();
  const isAuthenticated = !!user;

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {isAuthenticated ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create" element={<CreateChatbot />} />
          <Route path="knowledge-base/:id" element={<KnowledgeBase />} />
          <Route path="config/:id" element={<ChatbotConfig />} />
          <Route path="preview/:id" element={<ChatPreview />} />
          <Route path="deploy/:id" element={<Deployment />} />
          <Route path="analytics/:id" element={<Analytics />} />
          <Route path="conversations/:id" element={<ConversationHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
