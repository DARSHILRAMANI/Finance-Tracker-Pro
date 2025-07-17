import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${backendUrl}/api/auth/profile`);
        setUser(response.data || {});
      } catch (error) {
        console.error("Token verification failed:", error);
        setError(error.response?.data?.message || "Failed to verify token");
        logout(); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (loginData) => {
    try {
      setError(null);
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        loginData
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      toast.success("Login successful");
      setUser(user || {});
      return user;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      const errorMsg = error.response?.data?.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (registerData) => {
    try {
      setError(null);
      console.log("Registering with data:", registerData);
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        registerData
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      toast.success("Registration successful");
      setUser(user || {});
      return user;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      const errorMsg = error.response?.data?.message || "Registration failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.info("Logged out successfully");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setUser: updateUser,
        backendUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
