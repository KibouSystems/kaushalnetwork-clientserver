import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { User } from "lucide-react";

interface CompanyUser {
  id: number;
  username: string;
  name: string;
  designation: string;
  email: string;
  countryCode: string;
  contactNumber: string;
}

const CompanyUserList: React.FC = () => {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get("auth_token");
      if (!token) {
        toast.error("Auth token not found.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/v0/company-user/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading company users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">All Company Users</h1>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Designation</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Country Code</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Number</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="py-2 px-4 font-mono text-xs text-gray-500">{user.id}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.designation}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.countryCode}</td>
                <td className="py-2 px-4">{user.contactNumber}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyUserList;
