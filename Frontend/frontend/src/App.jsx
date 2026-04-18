import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';
import Navbar from './components/Navbar';

// ========== LOADING FALLBACK COMPONENT ==========
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f8f9fa'
  }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// ========== CODE SPLITTING: Lazy Load Route Components ==========
// Auth Pages (Lazy loaded)
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const EmailVerification = lazy(() => import('./pages/auth/EmailVerification'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResendVerification = lazy(() => import('./pages/auth/ResendVerification'));

// Patient Pages (Lazy loaded)
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const BookAppointment = lazy(() => import('./pages/patient/BookAppointment'));
const MyAppointments = lazy(() => import('./pages/patient/MyAppointments'));

// Doctor Pages (Lazy loaded)
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));

// Admin Pages (Lazy loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManageAppointments = lazy(() => import('./pages/admin/ManageAppointments'));
const ManageDoctors = lazy(() => import('./pages/admin/ManageDoctors'));

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  return <Navigate to="/patient" replace />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 56px)', background: '#f8f9fa' }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
          >
          <NotificationContainer />
          <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<LoadingFallback />}>
              <Register />
            </Suspense>
          } />
          <Route path="/verify-email" element={
            <Suspense fallback={<LoadingFallback />}>
              <EmailVerification />
            </Suspense>
          } />
          <Route path="/reset-password" element={
            <Suspense fallback={<LoadingFallback />}>
              <ResetPassword />
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<LoadingFallback />}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/resend-verification" element={
            <Suspense fallback={<LoadingFallback />}>
              <ResendVerification />
            </Suspense>
          } />
          <Route path="/" element={<RootRedirect />} />

          {/* ========== PATIENT ROUTES ========== */}
          <Route path="/patient" element={
            <ProtectedRoute roles={['PATIENT']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <PatientDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/book" element={
            <ProtectedRoute roles={['PATIENT']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <BookAppointment />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute roles={['PATIENT']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <MyAppointments />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          {/* ========== DOCTOR ROUTES ========== */}
          <Route path="/doctor" element={
            <ProtectedRoute roles={['DOCTOR']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <DoctorDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute roles={['DOCTOR']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <DoctorDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          {/* ========== ADMIN ROUTES ========== */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <ManageUsers />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <ManageAppointments />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <ManageDoctors />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          {/* ========== FALLBACK ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
