import axios from 'axios';

const API_URL = '/api/accounts';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const payload = { email, password };
      console.log("Sending Login Payload:", payload);
      const response = await api.post('/login/', payload);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Login API Error:", error);
      if (error.response?.status === 500) {
        console.error("Server 500 HTML Response:", error.response.data);

        // Try to extract useful info from Django HTML error page
        if (typeof error.response.data === 'string') {
          // Look for exception value in Django debug page
          const exceptionMatch = error.response.data.match(/class="exception_value">([^<]+)</);
          if (exceptionMatch && exceptionMatch[1]) {
            console.error("Server Exception:", exceptionMatch[1]);
            throw `Server Error: ${exceptionMatch[1]}`;
          }
        }
        throw "Server error (500). Check console logs for details.";
      }
      throw error.response?.data || error.message;
    }
  },

  // Signup user
  async signup(name, email, password) {
    try {
      // Simplified payload - let's start with basics
      const payload = {
        name,
        email,
        password
      };

      console.log("Sending Signup Payload:", payload);
      const response = await api.post('/signup/', payload);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Signup API Error:", error);
      if (error.response?.status === 500) {
        console.error("Server 500 HTML Response:", error.response.data);
        if (typeof error.response.data === 'string') {
          const exceptionMatch = error.response.data.match(/class="exception_value">([^<]+)</);
          if (exceptionMatch && exceptionMatch[1]) {
            console.error("Server Exception:", exceptionMatch[1]);
            throw `Server Error: ${exceptionMatch[1]}`;
          }
        }
        throw "Server error (500). Check console logs for details.";
      }
      throw error.response?.data || error.message;
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout user
  logout() {
    localStorage.removeItem('user');
  },
};

export default api;