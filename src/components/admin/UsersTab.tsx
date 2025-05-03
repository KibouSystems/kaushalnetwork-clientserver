import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { User, Mail, Phone, Briefcase, Lock, Globe, X } from "lucide-react";

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
      toast.success("User created successfully!");
      reset();
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-extrabold text-blue-900">Create Company User</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  {...register("username", { required: true })}
                  placeholder="Username"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.username ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
                />
              </div>
              {errors.username && <span className="text-xs text-red-500">Username is required</span>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="Password"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.password ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
                />
              </div>
              {errors.password && <span className="text-xs text-red-500">Password is required</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                {...register("name", { required: true })}
                placeholder="Full Name"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.name ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
              />
            </div>
            {errors.name && <span className="text-xs text-red-500">Name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                {...register("designation", { required: true })}
                placeholder="Designation"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.designation ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
              />
            </div>
            {errors.designation && <span className="text-xs text-red-500">Designation is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500">Email is required</span>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country Code</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  {...register("countryCode", { required: true })}
                  placeholder="+91"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.countryCode ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
                />
              </div>
              {errors.countryCode && <span className="text-xs text-red-500">Country code is required</span>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  {...register("contactNumber", {
                    required: true,
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Contact number must be exactly 10 digits"
                    }
                  })}
                  placeholder="10 digit number"
                  maxLength={10}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.contactNumber ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-200`}
                />
              </div>
              {errors.contactNumber && (
                <span className="text-xs text-red-500">{errors.contactNumber.message || "Contact number is required"}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg mt-4"
          >
            {isSubmitting ? "Submitting..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCompanyUserForm;
