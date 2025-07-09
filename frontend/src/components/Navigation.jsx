import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = ["dashboard", "transactions", "budgets", "goals", "analytics"];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab}
              to={tab === "dashboard" ? "/" : `/${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header */}
          {/* <div className="flex items-center justify-between py-4">
            <h1 className="text-lg font-semibold text-gray-900 capitalize">
              {activeTab}
            </h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>
          </div> */}

          {/* Mobile Tab Bar - Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center py-2">
              {tabs.map((tab) => (
                <Link
                  key={tab}
                  to={tab === "dashboard" ? "/" : `/${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-center transition-colors ${
                    activeTab === tab
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {/* Tab Icons */}
                  <div className="mb-1">
                    {tab === "dashboard" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    )}
                    {tab === "transactions" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                        <path d="M6 10h8v2H6v-2z" />
                      </svg>
                    )}
                    {tab === "budgets" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3h4v3H8z" />
                      </svg>
                    )}
                    {tab === "goals" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {tab === "analytics" && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium truncate capitalize">
                    {tab}
                  </span>
                  {/* Active indicator */}
                  {activeTab === tab && (
                    <div className="absolute top-0 w-8 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Dropdown Menu (if needed for additional options) */}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
