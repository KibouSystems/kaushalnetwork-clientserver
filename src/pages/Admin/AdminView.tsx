import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';
import axios from 'axios';
import { tokenManager } from '../../utils/tokenManager';
import UsersTab from '../../components/admin/UsersTab';
import CompanyUserList from '../../components/admin/CompanyUserList';
import CompanyBuzzList from '../../components/admin/CompanyBuzzList';
import CompanyDetailsTab from '../../components/admin/CompanyDetailsTab';
import TenderListTab from '../../components/admin/TenderListTab';

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

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/company/admin-view');
        setCompany(response.data);
      } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.log('Unauthorized access, redirecting to login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">No company data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 md:space-x-8 pt-2">
            {[
              { key: 'company', label: 'Company Details' },
              { key: 'users', label: 'Create User' },
              { key: 'allusers', label: 'All Users' },
              { key: 'buzz', label: 'Buzz Posts' },
              { key: 'tenders', label: 'Tenders' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative py-3 px-4 md:px-8 rounded-t-lg font-semibold text-sm md:text-base transition-all duration-200
                  ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                `}
                style={{ outline: 'none' }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-lg"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
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
