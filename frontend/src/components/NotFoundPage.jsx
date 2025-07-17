import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  CreditCard,
  Star,
  Sparkles,
  ChevronRight,
  Mail,
  MessageCircle,
  Target,
  PieChart,
  User,
} from "lucide-react";

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsVisible(true);

    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 2,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const popularPages = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Transactions", path: "/transactions", icon: CreditCard },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Budgets", path: "/budgets", icon: PieChart },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const helpOptions = [
    {
      name: "Contact Support",
      icon: Mail,
      action: () => console.log("Email support"),
    },
    {
      name: "Live Chat",
      icon: MessageCircle,
      action: () => console.log("Open chat"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated background sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          >
            <Sparkles
              className="text-blue-300 opacity-30"
              size={sparkle.size}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Main Content Container */}
        <div
          className={`
          max-w-2xl w-full text-center transition-all duration-500 transform
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
        >
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              404
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            We couldn't find the page you're looking for. Try searching or check
            out these helpful links.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our site..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm w-full sm:w-auto justify-center"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>

            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm w-full sm:w-auto justify-center"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Popular Pages */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center justify-center">
              <Star className="h-5 w-5 mr-2 text-blue-500" />
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularPages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => (window.location.href = page.path)}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-150 group border border-gray-100 hover:border-blue-200"
                >
                  <div className="p-2 bg-white rounded-lg shadow-xs group-hover:bg-blue-100 transition-colors">
                    <page.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-blue-800">
                    {page.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-2xl p-6 shadow-md border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              Need Help?
            </h2>
            <p className="text-gray-600 text-center mb-5">
              Our team is ready to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {helpOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex items-center space-x-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all duration-150 shadow-sm border border-gray-100"
                >
                  <option.icon className="h-5 w-5" />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
