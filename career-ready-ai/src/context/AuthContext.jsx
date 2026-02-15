import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create a separate component for the provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();

      if (user) {
        setCurrentUser(user);
      }

      setInitialCheckComplete(true);
      return user;
    } catch (err) {
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const user = await authService.login(email, password);
      setCurrentUser(user);
      setSuccess('Successfully logged in!');

      // Redirect to home or previous location
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

      return { success: true };
    } catch (err) {
      let errorMessage = 'Failed to log in. Please check your credentials.';

      if (err.response) {
        const { status, data } = err.response;

        if (status === 400 || status === 401) {
          errorMessage = data.detail || 'Invalid email or password';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const user = await authService.signup(name, email, password);
      setCurrentUser(user);
      setSuccess('Account created successfully! You are now logged in.');

      // Redirect to home after successful signup
      navigate('/', { replace: true });

      return { success: true };
    } catch (err) {
      let errorMessage = 'Failed to create an account. Please try again.';

      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          if (data && typeof data === 'object') {
            errorMessage = Object.entries(data)
              .map(([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(' ') : errors}`)
              .join('\n');
          } else if (data?.detail) {
            errorMessage = data.detail;
          }
        } else if (status === 409) {
          errorMessage = 'An account with this email already exists.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setSuccess('Successfully logged out!');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    } finally {
      setCurrentUser(null);
      setLoading(false);
      navigate('/auth/login');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const value = {
    currentUser,
    error,
    success,
    loading,
    login,
    signup,
    logout,
    clearMessages,
    isAuthenticated: !!currentUser,
  };

  // Only show loading spinner on initial load
  if (!initialCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;