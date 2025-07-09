import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { register, backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    // Basic Auth Info
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",

    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!registerData.confirmPassword == registerData.password) {
        throw new Error("Password not match");
      }

      const response = await axios.post(`${backendUrl}/api/auth/sent-otp`, {
        email: registerData.email,
      });

      toast.success("Verification email sent successfully");
      if (response.data.success) {
        setSuccess(
          "Verification code sent to your email. Please check your inbox."
        );
        setCurrentStep(2);
      } else {
        throw new Error(
          response.data.message || "Failed to send verification email"
        );
      }
    } catch (err) {
      toast.error("Failed to send verification email. Please try again.");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to send verification email. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email: registerData.email,
        otp: registerData.verificationCode,
      });

      if (response.data.success) {
        setIsEmailVerified(true);
        toast.success("Email verified successfully!");
        setSuccess("Email verified successfully!");
        setCurrentStep(3);
      } else {
        toast.error("Invalid verification code. Please try again.");
        throw new Error(response.data.message || "Invalid verification code");
      }
    } catch (err) {
      toast.error("Invalid verification code. Please try again.");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(registerData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                currentStep >= step
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 ${
                  currentStep > step ? "bg-emerald-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-between text-xs text-gray-500 mb-6 px-4">
      <span className={currentStep >= 1 ? "text-emerald-600 font-medium" : ""}>
        Email Setup
      </span>
      <span className={currentStep >= 2 ? "text-emerald-600 font-medium" : ""}>
        Verification
      </span>
      <span className={currentStep >= 3 ? "text-emerald-600 font-medium" : ""}>
        Complete Profile
      </span>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleSendVerification} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Setup Your Account</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter your email and basic credentials to get started
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            placeholder="Choose a username"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isVerifying}
        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending verification...
          </div>
        ) : (
          "Send Verification Email"
        )}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyEmail} className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
          <svg
            className="w-6 h-6 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 text-sm mt-1">
          We sent a verification code to <strong>{registerData.email}</strong>
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Verification Code
        </label>
        <input
          type="text"
          name="verificationCode"
          value={registerData.verificationCode}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-center text-lg font-mono"
          placeholder="Enter 6-digit code"
          maxLength="6"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <button
        type="submit"
        disabled={isVerifying || registerData.verificationCode.length !== 6}
        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </div>
        ) : (
          "Verify Email"
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to email setup
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSendVerification}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Resend verification code
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleFinalSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in your personal details to finish setting up your account
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={registerData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={registerData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={registerData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Phone"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Address Information
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={registerData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            placeholder="Street Address"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={registerData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={registerData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={registerData.zipCode}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Zip"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={registerData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          Create Account
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl mb-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 text-sm mt-1">
            Join Finance Tracker Pro today
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}
        {renderStepLabels()}

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Sign in
            </a>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 Finance Tracker Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
