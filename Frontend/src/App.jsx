// Frontend/src/App.jsx

import React, { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ToastMessage from './components/ToastMessage';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import './index.css' // Import ang Tailwind CSS directives

// Public Import Route
import LandingPage from './pages/LandingPage';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import Register from './auth/Register';
import OTP from './auth/OTP';
import ContactSupport from './pages/ContactSupport';
import Settings from './pages/Settings';
import NearbyHospitalMap from './pages/dashboard/NearbyHospitalMap';
import HelpSupport from './pages/Help&Support';
import HelpArticleDetail from './pages/template/HelpArticleDetail';
import AllFAQs from './pages/AllFAQs';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import LearnTemplate from './pages/LearnTemplate';
import Learn from './pages/Learn';
import Features from './pages/Features';
import Documentation from './pages/Documentation';
import DocumentDetails from './pages/template/DocumentDetails';

// Main Page of the System
import ChatPage from './pages/ChatPage';

import NotFound from './pages/error/NotFound';

// Protected or Private Import Routes
// Admin
import AdminLogin from './auth/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// User
import Dashboard from './pages/Dashboard';
import ArticlePage from './pages/ArticlePage';



function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* Redirect mula sa root path papuntang landing page */}
        <Route path="/" element={<Navigate to="/landingpage" replace />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />

        <Route path="/documentation" element={<Documentation />} />
        <Route path="/documentation/:slug" element={<DocumentDetails />} />

        {/* Shared ito para sa Guest at User kaya labas ito sa ProtectedRoute */}
        <Route path="/voice-assistant" element={<ChatPage />} />

        {/* LEARN SCOPE ROUTES */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/article-viewer/:topicId" element={<LearnTemplate />} />

        {/* HELP & SUPPORT MATRIX ROUTES */}
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/help-support/faq/:id" element={<HelpArticleDetail />} />
        <Route path="/help-support/all-faqs" element={<AllFAQs />} />

        {/* AUTH GATEWAY CORES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin-gateway" element={<AdminLogin />} />

        {/* Protected or Private Routes - Admin Scope */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Protected or Private Routes - User Scope */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/dashboard/nearby-hospital" element={<NearbyHospitalMap />} />

          <Route path="/dashboard/:tabName?" element={<Dashboard />} />
          <Route path="/dashboard/library/article/:id" element={<ArticlePage />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>

        {/* CATCH-ALL: Opsyonal, para sa mga 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastMessage />
    </BrowserRouter>
  )
}

export default App