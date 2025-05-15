import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { User, Mail, Phone, Briefcase, Lock, Globe, X, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  username: string;
  password: string;
  name: string;
  designation: string;
  email: string;
  countryCode: string;
  contactNumber: string;
}

const CreateCompanyUserForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    const token = Cookies.get("auth_token");
    if (!token) {
      toast.error("No auth token found.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/v0/company-user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      toast.success("User created successfully!");
      reset();
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Company User</h1>
              <p className="text-gray-500">Add new team members to your company account</p>
            </div>
          </motion.div>
        </div>

        {/* Form Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Lock className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-700">Account Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("username", { required: "Username is required" })}
                      placeholder="Username"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.username ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                    />
                  </div>
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("password", { required: "Password is required" })}
                      type="password"
                      placeholder="Secure password"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.password ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("name", { required: "Full name is required" })}
                      placeholder="Enter full name"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Job Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("designation", { required: "Designation is required" })}
                      placeholder="Enter job title"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.designation ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                    />
                  </div>
                  {errors.designation && <p className="text-xs text-red-500 mt-1">{errors.designation.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Mail className="w-4 h-4 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-700">Contact Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      type="email"
                      placeholder="email@example.com"
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Country Code</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register("countryCode", { required: "Country code is required" })}
                        placeholder="+91"
                        className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.countryCode ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                      />
                    </div>
                    {errors.countryCode && <p className="text-xs text-red-500 mt-1">{errors.countryCode.message}</p>}
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register("contactNumber", {
                          required: "Contact number is required",
                          pattern: {
                            value: /^\d{10}$/,
                            message: "Contact number must be exactly 10 digits"
                          }
                        })}
                        placeholder="10-digit number"
                        className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.contactNumber ? "border-red-300 bg-red-50" : "border-gray-200"} focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors`}
                      />
                    </div>
                    {errors.contactNumber && <p className="text-xs text-red-500 mt-1">{errors.contactNumber.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 flex flex-col sm:flex-row sm:justify-between gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="px-4 py-2 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`
                  relative px-8 py-2 sm:py-3 font-medium rounded-lg text-white 
                  ${isSuccess 
                    ? "bg-green-600" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"}
                  transition-all duration-200 shadow-md hover:shadow-lg
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5 mr-2 inline-block" />
                    User Created
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCompanyUserForm;
