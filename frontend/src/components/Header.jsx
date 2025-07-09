import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Wallet,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
  Home,
  PieChart,
  CreditCard,
  Target,
  BarChart,
  Flag,
  Bell,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "./Notifications";

const Header = ({ notifications = [] }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Optimized navigation items
  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/transactions",
      icon: CreditCard,
      label: "Transactions",
      badge: notifications.length > 0,
    },
    {
      path: "/budgets",
      icon: PieChart,
      label: "Budgets",
    },
    {
      path: "/goals",
      icon: Flag,
      label: "Goals",
      featured: true,
    },
    {
      path: "/analytics",
      icon: BarChart,
      label: "Investments",
      proFeature: true,
    },
  ];

  // Get user initials or fallback to "U"
  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.firstName
    ? user.firstName.slice(0, 1).toUpperCase() +
      (user.lastName ? user.lastName.slice(0, 1).toUpperCase() : "")
    : "U";

  const userName = user?.username || user?.firstName || user?.email || "User";

  // Close dropdowns when clicking outside or navigating
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Check if current route matches nav item
  const isActive = (item) => {
    return item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div
            className="flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-1.5 rounded-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              FinanceTracker
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive(item)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } ${item.featured ? "font-semibold" : ""} ${
                    item.proFeature
                      ? "text-purple-600 hover:text-purple-800"
                      : ""
                  }`}
                >
                  {item.label}
                  {item.badge && notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              ))}
            </div> */}

            <Notification notifications={notifications} />

            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 rounded-lg px-3 py-2"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                  {userInitials}
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium truncate">{userName}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle className="h-4 w-4 mr-3 text-gray-500" />
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation("/settings")}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      Settings
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            <Notification notifications={notifications} />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Mobile menu backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile menu content */}
          <div
            className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden"
            ref={mobileMenuRef}
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(100%)",
            }}
          >
            {/* User Info Section */}
            <div className="flex items-center px-5 py-5 border-b border-gray-100 bg-gray-50">
              <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full flex items-center justify-center text-base font-medium mr-4 shadow-sm">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 overflow-y-auto h-[calc(100%-80px)]">
              <div className="px-1 py-2">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Navigation
                </h3>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center w-full text-left px-4 py-3 text-sm ${
                      isActive(item)
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${item.featured ? "font-semibold" : ""} ${
                      item.proFeature ? "text-purple-600" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 mr-3 ${
                        isActive(item) ? "text-emerald-500" : "text-gray-400"
                      }`}
                    />
                    {item.label}
                    {item.badge && notifications.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                    {item.proFeature && (
                      <span className="ml-auto bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                        Pro
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="px-1 py-2 border-t border-gray-100">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle className="h-5 w-5 mr-3 text-gray-400" />
                  Profile
                </button>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-400" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-3 text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
