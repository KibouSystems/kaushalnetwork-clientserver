import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';
import { tokenManager } from '../../utils/tokenManager';
import UsersTab from '../../components/admin/UsersTab';
import CompanyUserList from '../../components/admin/CompanyUserList';
import CompanyBuzzList from '../../components/admin/CompanyBuzzList';
import CompanyDetailsTab from '../../components/admin/CompanyDetailsTab';
import TenderListTab from '../../components/admin/TenderListTab';
import { Building2, Users, UserPlus, MessageSquare, FileText } from 'lucide-react';

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
  branches: Array<{ id: number; branchAddress: string; }>;
  brands: Array<{ id: number; brandName: string; }>;
}

export default function AdminView() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'company' | 'users' | 'allusers' | 'buzz' | 'tenders'>('company');
  const [email, setEmail] = useState<string | null>(null);

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
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-lg font-medium mb-2">No company data available</div>
          <p className="text-gray-600">Please check your account configuration or contact support.</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { key: 'company', label: 'Company Details', icon: Building2 },
    { key: 'users', label: 'Create User', icon: UserPlus },
    { key: 'allusers', label: 'All Users', icon: Users },
    { key: 'buzz', label: 'Buzz Posts', icon: MessageSquare },
    { key: 'tenders', label: 'Tenders', icon: FileText }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {company.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <div className="font-medium text-gray-800 truncate">{company.companyName}</div>
              <div className="text-xs text-gray-500 truncate">{email}</div>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-2 mt-2">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`w-full flex items-center px-4 py-3 rounded-md mb-1 text-left transition-all
                ${activeTab === item.key
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={18} className={`mr-3 ${activeTab === item.key ? 'text-blue-600' : 'text-gray-500'}`} />
              {item.label}
              {activeTab === item.key && (
                <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
        
        {/* Company Status */}
        <div className="p-4 mt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${company.verified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
            <span className={`text-sm ${company.verified ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
              {company.verified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {company.companyType} • {company.sector}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigationItems.find(item => item.key === activeTab)?.label}
            </h1>
          </div>
        </header>
        
        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'company' ? (
              <CompanyDetailsTab company={company} />
            ) : activeTab === 'users' ? (
              <UsersTab />
            ) : activeTab === 'allusers' ? (
              <CompanyUserList />
            ) : activeTab === 'buzz' ? (
              <CompanyBuzzList />
            ) : (
              <TenderListTab />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) => (
  <div className="mb-2">
    <span className="text-gray-600 text-sm">{label}:</span>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline text-sm">{value}</a>
    ) : (
      <span className="ml-2 font-medium text-gray-900 text-sm">{value || 'N/A'}</span>
    )}
  </div>
);

const DocumentLink = ({ label, url }: { label: string; url: string | null }) => (
  <div className="mb-2">
    {url ? (
      <a 
        href={`http://localhost:3000/${url}`}
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
