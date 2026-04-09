import { useState } from 'react';
import ProtectedRoute from './ProtectedRoutes/protectedroutes';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ToastMessage from './components/ToastMessage';

import LandingPage from './Guest/landingpage';
import Login from './Guest/Authentication/login';
import Register from './Guest/Authentication/register';
import ForgotPassword from './Guest/Authentication/forgotpassword';
import OTPVerification from './Guest/Authentication/otp';
import TermsAndCondition from './pages/terms';
import PrivacyPolicy from './pages/privacy';
import AdminDashboard from './Admin/admin';
import Dashboard from './Users/user-dashboard/dashboard';
import VoiceAssistantInteraction from './Users/voice-interaction/assistant.jsx';

// Ito yung main file ng frontend, 
// dito siya magrurun, 
// dito rin yung mga routes ng frontend

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <ToastMessage />
      <Routes>
        {/* Guest or Public Routes */}
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPVerification />} />
        
        <Route path="/terms" element={<TermsAndCondition />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected or Private Routes */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="" element={<AdminDashboard />} />
        </Route>

        {/* Protected or Private Routes */}
        <Route path="/dashboard/*" element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="" element={<Dashboard />} />
          <Route path="voice-assistant" element={<VoiceAssistantInteraction />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
