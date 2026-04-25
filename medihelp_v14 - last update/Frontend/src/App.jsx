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
import HealthProfile from './Users/health-profile/profile.jsx';
import GuidanceLibrary from './Users/guidance-library/library.jsx';
import AllArticles from './Users/guidance-library/library-compo/AllArticles.jsx';
import LearnHow from './pages/learnhow.jsx';
import ArticlePage from './Users/guidance-library/library-compo/ArticlePage';
import ArticleNotFound from './pages/error/ArticleNotFound';
import ChatPage from './Guest/guest-compo/chatpage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HealthRecord from './Users/health-profile/healthRecord.jsx';
import HelpSupport from './pages/helpsupport.jsx';
import NavigationTracker from './components/NavigationTracker.jsx';
import ArchivedHistory from './Users/guidance-library/library-compo/ArchivedHistory';
import SystemGuideDetail from './pages/systemguidedetail.jsx'
import SavedArticle from './Users/guidance-library/SavedArticle';

// Ito yung main file ng frontend, 
// dito siya magrurun, 
// dito rin yung mga routes ng frontend

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <NavigationTracker />
      <ScrollToTop />
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
        <Route path="/learn-how" element={<LearnHow />} />
        <Route path="/learn-how/system-guide-detail/:featureId" element={<SystemGuideDetail />} />
        <Route path="/chat-response" element={<ChatPage />} />

        {/* Protected or Private Routes */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="" element={<AdminDashboard />} />
        </Route>

        {/* Protected or Private Routes */}
        <Route path="/dashboard/*" element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="" element={<Dashboard />} />
          <Route path="voice-assistant" element={<VoiceAssistantInteraction />} />
          <Route path="health-profile" element={<HealthProfile />} /> 
          <Route path="health-profile/records" element={<HealthRecord />} />
          <Route path="guidance-library" element={<GuidanceLibrary />} />
          <Route path="guidance-library/all-articles" element={<AllArticles />} />
          <Route path="guidance-library/article/:id" element={<ArticlePage />} />
          <Route path="guidance-library/archives" element={<ArchivedHistory />} />
          <Route path="guidance-library/save-library" element={<SavedArticle />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="*" element={<ArticleNotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
