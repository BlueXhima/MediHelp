import { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { HelpCenter } from './pages/HelpCenter.jsx';
import { Documentation } from './pages/Documentation.jsx';
import { StatusPage } from './pages/StatusPage.jsx';
import { Contact } from './pages/Contact.jsx';
import { Blog } from './pages/Blog.jsx';
import { PrivacyPolicy } from './pages/PrivacyPolicy.jsx';
import { Terms } from './pages/Terms.jsx';
import { MedicalDisclaimer } from './pages/MedicalDisclaimer.jsx';
import { CookiePolicy } from './pages/CookiePolicy.jsx';
import { UserDashboard } from './pages/user-dashboard/index.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import ScrollToTop from "./components/ScrollToTop.jsx";
import { VoiceAssistantInteraction } from './pages/voice-assistant-interaction/index.jsx';
import { HealthProfile } from './pages/health-profile/index.jsx';
import { GuidanceLibrary } from './pages/guidance-library/index.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LearnHow from './pages/user-dashboard/components/LearnHow.jsx';

function AppRoutes() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Restore the last visited route
    const lastVisitedPage = localStorage.getItem('lastVisitedPage');
    if (lastVisitedPage) {
      window.history.replaceState(null, '', lastVisitedPage);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<MedicalDisclaimer />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/voice-assistant" element={<VoiceAssistantInteraction />} />
          <Route path="/health-profile" element={<HealthProfile />} />
          <Route path="/guidance-library" element={<GuidanceLibrary />} />
          <Route path="/learn-how" element={<LearnHow />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </>
  );
}

function App() {
    return (
        <AuthProvider>
            <ErrorBoundary>
                <AppRoutes />
            </ErrorBoundary>
        </AuthProvider>
    );
}

export default App
