// frontend/src/api/axios-instance.ts
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// Create a new Axios instance
const axiosInstance = axios.create({
  // Your NestJS backend's URL
  baseURL: 'http://localhost:3000', 
});

// Use an interceptor to add the JWT to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString(); // Get the ID token

      if (token) {
        // Add the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (e) {
      console.error('No user session found');
      // You can also handle redirects to login here
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;