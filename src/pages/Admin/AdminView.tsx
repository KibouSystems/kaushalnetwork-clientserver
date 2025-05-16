import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';
import { tokenManager } from '../../utils/tokenManager';
import UsersTab from '../../components/admin/UsersTab';
import CompanyUserList from '../../components/admin/CompanyUserList';
import CompanyBuzzList from '../../components/admin/CompanyBuzzList';
import CompanyDetailsTab from '../../components/admin/CompanyDetailsTab';
import TenderListTab from '../../components/admin/TenderListTab';
import CompanyChatTab from '../../components/admin/CompanyChatTab';
import {
  Building2,
  Users,
  UserPlus,
  MessageSquare,
  FileText,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';

interface CompanyData {
  id: number;
  verified: boolean;
  companyName: string;
  tradeName: string;
  legalName: string;
  companyType: string;
  email: string;
  logoUrl: string;
  bannerUrl: string | null;
  tagline: string | null;
  entityType: string;
  incorporationYear: number;
  registeredOfficeAddress: string;
  websiteUrl: string;
  businessType: string;
  deliverableNames: string;
  sector: string;
  industry: string;
  minEmployeeCount: number;
  maxEmployeeCount: number;
  msmeRegistrationNumber: string;
  msmeRegistrationDocumentUrl: string;
  cin: string;
  cinDocumentUrl: string;
  pan: string;
  panUrl: string;
  gstin: string;
  gstinDocumentUrl: string;
  tradeLicenseNumber: string;
  tradeLicenseDocumentUrl: string | null;
  iecNumber: string;
  iecDocumentUrl: string | null;
  aadharNumber: string;
  aadharDocumentUrl: string;
  aboutCompany: string | null;
  aboutFounderAndTeam: string | null;
  expertise: string | null;
  branches: Array<{ id: number; branchAddress: string }>;
  brands: Array<{ id: number; brandName: string }>;
}

export default function AdminView() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'company' | 'users' | 'allusers' | 'buzz' | 'tenders' | 'chats'
  >('company');
  const [email, setEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/company/admin-view');
        setCompany(response.data);

        // Extract email from token
        const token = tokenManager.getToken();
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );
            const payload = JSON.parse(jsonPayload);
            setEmail(payload.email || null);
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }
      } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking a navigation item on mobile
  const handleNavItemClick = (tabKey: typeof activeTab) => {
    setActiveTab(tabKey);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center w-full max-w-md">
          <div className="text-red-500 text-lg font-medium mb-2">No company data available</div>
          <p className="text-gray-600">
            Please check your account configuration or contact support.
          </p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { key: 'company', label: 'Company Details', icon: Building2 },
    { key: 'users', label: 'Create User', icon: UserPlus },
    { key: 'allusers', label: 'All Users', icon: Users },
    { key: 'buzz', label: 'Buzz Posts', icon: MessageSquare },
    { key: 'tenders', label: 'Tenders', icon: FileText },
    { key: 'chats', label: 'Chat History', icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Repositioned to prevent overlapping */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed width, no overflow issues */}
      <div
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed md:sticky 
          top-0 md:top-0 
          left-0 
          h-full 
          w-64 
          md:flex-shrink-0
          bg-white 
          shadow-md 
          z-40 
          transition-transform 
          duration-300 
          ease-in-out
          overflow-y-auto
          md:self-start
        `}
        style={{ height: '100vh' }}
      >
        {/* Company Info Header */}
        <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {company?.companyName.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3 overflow-hidden">
              <div className="font-medium text-gray-800 truncate">
                {company?.companyName || 'Company Name'}
              </div>
              <div className="text-xs text-gray-500 truncate">{email || 'email@example.com'}</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 overflow-y-auto">
          {navigationItems.map(item => (
            <button
              key={item.key}
              onClick={() => handleNavItemClick(item.key as any)}
              className={`w-full flex items-center px-4 py-3 rounded-md mb-2 text-left transition-all
                ${
                  activeTab === item.key
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon
                size={18}
                className={`mr-3 ${activeTab === item.key ? 'text-blue-600' : 'text-gray-500'}`}
              />
              <span className="truncate">{item.label}</span>
              {activeTab === item.key && (
                <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Company Status - Sticky at bottom */}
        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${company?.verified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}
            ></div>
            <span
              className={`text-sm ${company?.verified ? 'text-green-600' : 'text-yellow-600'} font-medium`}
            >
              {company?.verified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {company?.companyType} • {company?.sector}
          </div>
        </div>
      </div>

      {/* Main Content - Proper spacing and no overlapping */}
      <div className="flex-1 w-full md:w-auto">
        {/* Top header with adequate spacing for mobile menu button */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 md:px-6 py-4 md:py-4 flex justify-between items-center ml-12 md:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigationItems.find(item => item.key === activeTab)?.label}
            </h1>

            {/* Mobile indicator for current tab */}
            <div className="md:hidden flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></div>
              <span className="text-sm font-medium text-gray-700">
                {company?.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </header>

        {/* Content area with proper padding */}
        <main className="p-4 pt-6 md:p-6 md:pt-6">
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'company' ? (
              <CompanyDetailsTab company={company} />
            ) : activeTab === 'users' ? (
              <UsersTab />
            ) : activeTab === 'allusers' ? (
              <CompanyUserList />
            ) : activeTab === 'buzz' ? (
              <CompanyBuzzList />
            ) : activeTab === 'chats' ? (
              <CompanyChatTab />
            ) : (
              <TenderListTab />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const InfoItem = ({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) => (
  <div className="mb-2">
    <span className="text-gray-600 text-sm">{label}:</span>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-blue-600 hover:underline text-sm"
      >
        {value}
      </a>
    ) : (
      <span className="ml-2 font-medium text-gray-900 text-sm">{value || 'N/A'}</span>
    )}
  </div>
);

const DocumentLink = ({ label, url }: { label: string; url: string | null }) => (
  <div className="mb-2">
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        {label} ↗
      </a>
    ) : (
      <span className="text-gray-400 text-sm">{label} (Not available)</span>
    )}
  </div>
);
