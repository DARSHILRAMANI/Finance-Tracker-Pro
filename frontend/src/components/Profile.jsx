import React, { useState, useContext, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser, token, backendUrl } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userData = user?.user || user;

  const [editData, setEditData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    profile: {
      firstName: userData?.profile?.firstName || "",
      lastName: userData?.profile?.lastName || "",
      dateOfBirth: userData?.profile?.dateOfBirth || "",
      gender: userData?.profile?.gender || "",
      phoneNumber: userData?.profile?.phoneNumber || "",
      address: {
        street: userData?.profile?.address?.street || "",
        city: userData?.profile?.address?.city || "",
        state: userData?.profile?.address?.state || "",
        country: userData?.profile?.address?.country || "",
        zipCode: userData?.profile?.address?.zipCode || "",
      },
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: userData?.username || "",
      email: userData?.email || "",
      profile: {
        firstName: userData?.profile?.firstName || "",
        lastName: userData?.profile?.lastName || "",
        dateOfBirth: userData?.profile?.dateOfBirth || "",
        gender: userData?.profile?.gender || "",
        phoneNumber: userData?.profile?.phoneNumber || "",
        address: {
          street: userData?.profile?.address?.street || "",
          city: userData?.profile?.address?.city || "",
          state: userData?.profile?.address?.state || "",
          country: userData?.profile?.address?.country || "",
          zipCode: userData?.profile?.address?.zipCode || "",
        },
      },
    });
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editData.profile.firstName,
          lastName: editData.profile.lastName,
          dateOfBirth: editData.profile.dateOfBirth,
          gender: editData.profile.gender,
          phoneNumber: editData.profile.phoneNumber,
          address: editData.profile.address.street,
          city: editData.profile.address.city,
          state: editData.profile.address.state,
          zipCode: editData.profile.address.zipCode,
          country: editData.profile.address.country,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      setUser(responseData.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {editData.profile.firstName} {editData.profile.lastName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      {editData.email}
                    </span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-white/60 rounded-full"></div>
                  <span className="text-sm sm:text-base">
                    @{editData.username}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 sm:px-8 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span className="font-medium">Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isLoading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span className="font-medium">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.firstName}
                      onChange={(e) =>
                        handleInputChange("profile.firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.firstName || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.lastName}
                      onChange={(e) =>
                        handleInputChange("profile.lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.lastName || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.profile.gender}
                      onChange={(e) =>
                        handleInputChange("profile.gender", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium capitalize">
                        {editData.profile.gender || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        editData.profile.dateOfBirth
                          ? editData.profile.dateOfBirth.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("profile.dateOfBirth", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {formatDate(editData.profile.dateOfBirth)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.profile.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("profile.phoneNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.phoneNumber || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.address.street}
                      onChange={(e) =>
                        handleInputChange(
                          "profile.address.street",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter street address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.address.street || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.address.city}
                      onChange={(e) =>
                        handleInputChange(
                          "profile.address.city",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter city"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.address.city || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.address.state}
                      onChange={(e) =>
                        handleInputChange(
                          "profile.address.state",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter state"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.address.state || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.address.country}
                      onChange={(e) =>
                        handleInputChange(
                          "profile.address.country",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter country"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.address.country || "N/A"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zip Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.profile.address.zipCode}
                      onChange={(e) =>
                        handleInputChange(
                          "profile.address.zipCode",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isLoading}
                      placeholder="Enter zip code"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                      <p className="text-gray-900 font-medium">
                        {editData.profile.address.zipCode || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                    <p className="text-gray-900 font-medium">
                      {editData.username}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent">
                    <p className="text-gray-900 font-medium">
                      {editData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
