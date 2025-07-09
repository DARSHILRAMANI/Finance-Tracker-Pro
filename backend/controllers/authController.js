const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const dotenv = require("dotenv");
dotenv.config();

// Validate environment variables
const validateEnv = () => {
  const required = ["EMAIL_USER", "EMAIL_PASS", "JWT_SECRET"];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};

// Validate on startup
validateEnv();

const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error("Failed to create email transporter:", error);
    throw error;
  }
};

const transporter = createTransporter();

// Enhanced OTP store with automatic cleanup
class OTPStore {
  constructor() {
    this.store = {};
    // Clean up expired OTPs every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  set(email, data) {
    this.store[email] = data;
  }

  get(email) {
    return this.store[email];
  }

  delete(email) {
    delete this.store[email];
  }

  cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach((email) => {
      if (this.store[email].expires < now) {
        delete this.store[email];
      }
    });
  }
}

const otpStore = new OTPStore();

// Enhanced email validation
const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Send Welcome Email with enhanced validation and error handling
const sendWelcomeEmail = async (email, firstName, username) => {
  try {
    // Validate email parameter
    if (!email || !firstName || !username) {
      throw new Error(
        "Email, first name, and username are required for welcome email."
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = firstName || username;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "Welcome to Finance Tracker Pro! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #2563eb); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Welcome to Finance Tracker Pro!</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Hi ${displayName}! 👋</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Congratulations! Your account has been successfully created. Welcome to Finance Tracker Pro, your personal finance management companion.
            </p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="color: #059669; margin: 0 0 10px 0;">🚀 Get Started:</h3>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li>Set up your financial goals</li>
                <li>Connect your accounts</li>
                <li>Start tracking your expenses</li>
                <li>Create your first budget</li>
              </ul>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 10px 0;">📊 Your Account Details:</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Username:</strong> ${username}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Email:</strong> ${cleanEmail}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #059669; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block; text-decoration: none;">
                <strong>🎯 Start Managing Your Finances Today!</strong>
              </div>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0; text-align: center;">
                © 2024 Finance Tracker Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw error;
  }
};

// Send OTP email with enhanced validation and error handling
const sendOtpEmail = async (email, otp) => {
  try {
    // Validate email parameter
    if (!email || !isValidEmail(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }

    // Validate OTP
    if (!otp || typeof otp !== "string") {
      throw new Error("Invalid OTP provided");
    }

    const cleanEmail = email.trim().toLowerCase();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "Finance Tracker Pro - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #2563eb); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Finance Tracker Pro</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              You have requested to reset your password. Use the OTP below to proceed:
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #059669; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h3>
            </div>
            <p style="color: #6b7280; margin-bottom: 20px;">
              This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.
            </p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                © 2024 Finance Tracker Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};

// Enhanced input validation
const validateRegistrationInput = (data) => {
  const errors = [];

  if (
    !data.username ||
    typeof data.username !== "string" ||
    data.username.trim().length < 3
  ) {
    errors.push("Username must be at least 3 characters long");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (
    !data.password ||
    typeof data.password !== "string" ||
    data.password.length < 6
  ) {
    errors.push("Password must be at least 6 characters long");
  }

  if (data.password !== data.confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
};

const register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      verificationCode,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body || {};

    // Enhanced validation
    const validationErrors = validateRegistrationInput({
      username,
      email,
      password,
      confirmPassword,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          existing.email === cleanEmail
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user object
    const userObj = {
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      profile: {
        firstName: firstName?.trim() || "",
        lastName: lastName?.trim() || "",
        dateOfBirth: dateOfBirth || null,
        gender: gender?.trim() || "",
        phoneNumber: phoneNumber?.trim() || "",
        address: {
          street: address?.trim() || "",
          city: city?.trim() || "",
          state: state?.trim() || "",
          zipCode: zipCode?.trim() || "",
          country: country?.trim() || "",
        },
      },
    };

    // Only add verificationCode if it's provided
    if (verificationCode) {
      userObj.verificationCode = verificationCode;
    }

    const user = new User(userObj);
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send welcome email automatically after successful registration
    try {
      await sendWelcomeEmail(
        cleanEmail,
        firstName?.trim() || cleanUsername,
        cleanUsername
      );

      // Return success response with email confirmation
      res.status(201).json({
        success: true,
        token,
        user: userResponse,
        message: "Registration successful! Welcome email sent to your inbox.",
        emailSent: true,
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);

      // Return success response but indicate email issue
      res.status(201).json({
        success: true,
        token,
        user: userResponse,
        message:
          "Registration successful! However, welcome email could not be sent.",
        emailSent: false,
        emailError: "Failed to send welcome email",
      });
    }
  } catch (err) {
    console.error("Registration error:", err);

    // Handle specific MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user (case-insensitive email)
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      username,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if username is already taken by another user
    if (username && username.trim() !== user.username) {
      const existingUser = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username.trim();
    }

    // Update profile fields
    user.profile = {
      ...user.profile,
      firstName: firstName?.trim() || user.profile.firstName,
      lastName: lastName?.trim() || user.profile.lastName,
      dateOfBirth: dateOfBirth || user.profile.dateOfBirth,
      gender: gender?.trim() || user.profile.gender,
      phoneNumber: phoneNumber?.trim() || user.profile.phoneNumber,
      address: {
        street: address?.trim() || user.profile.address?.street,
        city: city?.trim() || user.profile.address?.city,
        state: state?.trim() || user.profile.address?.state,
        zipCode: zipCode?.trim() || user.profile.address?.zipCode,
        country: country?.trim() || user.profile.address?.country,
      },
    };

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    next(err);
  }
};

// Error handler helper
const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

// Send forgot password OTP
const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    otpStore.set(cleanEmail, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    await sendOtpEmail(cleanEmail, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedData = otpStore.get(cleanEmail);

    const user = await User.findOne({ email: cleanEmail });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "already register email please login",
      });
    }

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email",
      });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one",
      });
    }

    if (storedData.attempts >= 3) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    if (storedData.otp !== otp.toString()) {
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    storedData.verified = true;

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Reset password with verified OTP
const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedData = otpStore.get(cleanEmail);

    if (
      !storedData ||
      storedData.otp !== otp.toString() ||
      !storedData.verified
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unverified OTP",
      });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
      { email: cleanEmail },
      { password: hashedPassword }
    );

    otpStore.delete(cleanEmail);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = crypto.randomInt(100000, 999999).toString();

    otpStore.set(cleanEmail, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    await sendOtpEmail(cleanEmail, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    otpStore.set(cleanEmail, {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    await sendOtpEmail(cleanEmail, otp);

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email address",
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateUserProfile,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  verifyOtp,
  resendOtp,
  sentOtp,
  sendWelcomeEmail,
};
