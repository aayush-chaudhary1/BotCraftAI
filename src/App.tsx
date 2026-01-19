import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Landing Page - Public */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LandingPage />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <SignUpPage onSignUp={() => setIsAuthenticated(true)} />
          } 
        />
        
        {isAuthenticated ? (
          <Route path="/" element={<DashboardLayout onLogout={() => setIsAuthenticated(false)} />}>
            <Route index element={<Navigate to="/dashboard" />} />
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
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;