import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LandingPage from '../pages/landing.jsx';

// Use lazy loading for better performance
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const Signup = lazy(() => import('../pages/auth/Signup.jsx'));

// Simple loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <h1 className="text-2xl font-bold text-white">404 - Page Not Found</h1>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;