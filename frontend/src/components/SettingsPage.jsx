import React, { useState } from "react";
import {
  Bell,
  Shield,
  Palette,
  ChevronRight,
  ArrowLeft,
  Settings,
  Construction,
  Clock,
  DollarSign,
  Globe,
  Lock,
  Smartphone,
  Check,
  AlertCircle,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("main");

  const ComingSoonItem = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 opacity-80">
      <div className="flex items-center flex-1">
        <div className="p-2 rounded-full mr-3 bg-blue-100">
          <Icon size={20} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800 truncate">{title}</h3>
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
              Coming Soon
            </span>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <Construction size={16} className="text-blue-500 ml-2" />
    </div>
  );

  const Header = ({ title, onBack }) => (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10">
      {onBack && (
        <button
          onClick={onBack}
          className="mr-3 p-2 -ml-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      )}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    </div>
  );

  const FeaturePreviewCard = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mx-4 my-6">
      <div className="flex items-center mb-3">
        <div className="p-3 bg-blue-100 rounded-full mr-3">
          <Settings size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Feature Preview</h3>
          <div className="flex items-center mt-1">
            <Clock size={14} className="text-blue-600 mr-1" />
            <span className="text-sm text-blue-600 font-medium">
              Under Development
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm">
        Our team is working on bringing you a complete settings experience. Stay
        tuned for updates!
      </p>
    </div>
  );

  const renderMainMenu = () => (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Settings" />

      <FeaturePreviewCard />

      <div className="bg-white">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-800">Application</h3>
        </div>

        <ComingSoonItem
          icon={Bell}
          title="Notifications"
          subtitle="Manage your alert preferences"
        />
        <ComingSoonItem
          icon={Palette}
          title="Appearance"
          subtitle="Customize theme and layout"
        />
        <ComingSoonItem
          icon={Globe}
          title="Language"
          subtitle="Set your preferred language"
        />
      </div>

      <div className="bg-white mt-4">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-800">Security</h3>
        </div>

        <ComingSoonItem
          icon={Lock}
          title="Password"
          subtitle="Change your login credentials"
        />
        <ComingSoonItem
          icon={Smartphone}
          title="Two-Factor Auth"
          subtitle="Enable additional security"
        />
        <ComingSoonItem
          icon={Shield}
          title="Privacy"
          subtitle="Configure data sharing"
        />
      </div>

      <div className="bg-white mt-4 mb-8">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-800">Financial</h3>
        </div>

        <ComingSoonItem
          icon={DollarSign}
          title="Currency"
          subtitle="Set default currency"
        />
        <ComingSoonItem
          icon={Check}
          title="Budgets"
          subtitle="Configure spending limits"
        />
        <ComingSoonItem
          icon={AlertCircle}
          title="Alerts"
          subtitle="Set financial notifications"
        />
      </div>
    </div>
  );

  const renderComingSoonPage = (title, Icon) => (
    <div className="bg-gray-50 min-h-screen">
      <Header title={title} onBack={() => setActiveTab("main")} />

      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <div className="p-6 bg-blue-100 rounded-full mb-6">
          <Icon size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
          {title} In Development
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          This feature is currently being built. We'll notify you when it's
          ready to use!
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "main":
        return renderMainMenu();
      case "notifications":
        return renderComingSoonPage("Notifications", Bell);
      case "security":
        return renderComingSoonPage("Security", Shield);
      case "appearance":
        return renderComingSoonPage("Appearance", Palette);
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm md:my-6 md:rounded-lg overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default SettingsPage;
