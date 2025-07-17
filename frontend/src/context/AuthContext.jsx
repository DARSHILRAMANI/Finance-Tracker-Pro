// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(
//     () => localStorage.getItem("token") || null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const verifyToken = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         const response = await axios.get(`${backendUrl}/api/auth/profile`);
//         setUser(response.data || {});
//       } catch (error) {
//         console.error("Token verification failed:", error);
//         setError(error.response?.data?.message || "Failed to verify token");
//         logout(); // Clear invalid token
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyToken();
//   }, [token]);

//   const login = async (loginData) => {
//     try {
//       setError(null);
//       const response = await axios.post(
//         `${backendUrl}/api/auth/login`,
//         loginData
//       );
//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       setToken(token);
//       toast.success("Login successful");
//       setUser(user || {});
//       return user;
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Login failed. Please try again."
//       );
//       const errorMsg = error.response?.data?.message || "Login failed";
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     }
//   };

//   const register = async (registerData) => {
//     try {
//       setError(null);
//       console.log("Registering with data:", registerData);
//       const response = await axios.post(
//         `${backendUrl}/api/auth/register`,
//         registerData
//       );
//       const { token, user } = response.data;

//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       setToken(token);
//       toast.success("Registration successful");
//       setUser(user || {});
//       return user;
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Registration failed. Please try again."
//       );
//       const errorMsg = error.response?.data?.message || "Registration failed";
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     toast.info("Logged out successfully");
//     setToken(null);
//     setUser(null);
//     setError(null);
//   };

//   const updateUser = (updatedUser) => {
//     setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         error,
//         login,
//         register,
//         logout,
//         setUser: updateUser,
//         backendUrl,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    // Check if token exists and hasn't expired
    if (storedToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        return storedToken;
      } else {
        // Token expired, remove it
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper function to set token with expiration
  const setTokenWithExpiry = (newToken) => {
    const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    setToken(newToken);
  };

  // Helper function to check if token is expired
  const isTokenExpired = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!tokenExpiry) return true;

    const now = new Date().getTime();
    return now >= parseInt(tokenExpiry);
  };

  // Helper function to get remaining time until token expires
  const getTokenExpiryTime = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!tokenExpiry) return null;

    const expiryTime = parseInt(tokenExpiry);
    const now = new Date().getTime();
    const remainingTime = expiryTime - now;

    return remainingTime > 0 ? remainingTime : 0;
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || isTokenExpired()) {
        logout();
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

  // Set up automatic token expiration check
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired()) {
        toast.warning("Your session has expired. Please log in again.");
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Also set a timeout for exact expiry time
    const remainingTime = getTokenExpiryTime();
    if (remainingTime > 0) {
      const timeoutId = setTimeout(() => {
        toast.warning("Your session has expired. Please log in again.");
        logout();
      }, remainingTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
      };
    }

    return () => clearInterval(interval);
  }, [token]);

  const login = async (loginData) => {
    try {
      setError(null);
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        loginData
      );
      const { token, user } = response.data;

      setTokenWithExpiry(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

      setTokenWithExpiry(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
    localStorage.removeItem("tokenExpiry");
    delete axios.defaults.headers.common["Authorization"];
    toast.info("Logged out successfully");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  // Function to get time until token expires (useful for UI)
  const getTimeUntilExpiry = () => {
    const remainingTime = getTokenExpiryTime();
    if (!remainingTime) return null;

    const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor(
      (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
    );

    return { days, hours, minutes, totalMs: remainingTime };
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
        isTokenExpired,
        getTimeUntilExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
