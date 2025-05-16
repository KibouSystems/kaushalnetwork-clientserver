/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
  Building,
  Globe,
  Users,
  FileText,
  Tag,
} from 'lucide-react';
import axios from 'axios';
import SuperadminLogin from '../Superadmin/SuperadminLogin';
import { SuperAdminCompanyModal } from '../../../components/admin/SuperAdminCompanyModal';

interface Company {
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
  aboutCompany: string | null;
  aboutFounderAndTeam: string | null;
  expertise: string | null;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) {
      navigate('/superadmin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchCompanies();
  }, [navigate]);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, filterStatus, companies]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/company/all');
      setCompanies(response.data);
      console.warn('Fetched companies:', response.data);
    } catch (error) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const refreshCompanies = async () => {
    try {
      setRefreshing(true);
      await fetchCompanies();
      toast.success('Companies refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        company =>
          company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply verification status filter
    if (filterStatus === 'verified') {
      filtered = filtered.filter(company => company.verified);
    } else if (filterStatus === 'unverified') {
      filtered = filtered.filter(company => !company.verified);
    }

    setFilteredCompanies(filtered);
  };

  const handleVerify = async (companyId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const adminToken = Cookies.get('admin_token'); // Get token from cookies

      const loadingToastId = toast.loading('Verifying company...');

      await axios.put(
        `http://69.62.79.102:3000/api/v0/company/verify?companyId=${companyId}`,
        {},
        {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : '',
          },
        }
      );

      toast.dismiss(loadingToastId);
      toast.success('Company verified successfully');

      // Update state locally
      setCompanies(prev =>
        prev.map(company => (company.id === companyId ? { ...company, verified: true } : company))
      );
    } catch (error) {
      toast.error('Failed to verify company');
      console.error('Verification error:', error);
    }
  };

  const toggleExpand = (companyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Instead of controlling expandedCompanyId (local expand),
    // we now set selectedCompanyId to show the modal with detailed view
    setSelectedCompanyId(companyId);
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder-logo.png';
    return path.startsWith('http') ? path : `http://69.62.79.102:3000/${path.replace(/\\/g, '/')}`;
  };

  const handleLogout = () => {
    Cookies.remove('admin_token');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <SuperadminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        <p className="mt-4 text-sm text-gray-600">
          Please log in as admin to access the dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with logout */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900"> Super Admin Dashboard</h1>
              <p className="text-gray-600">
                {filteredCompanies.length}{' '}
                {filteredCompanies.length === 1 ? 'company' : 'companies'} found
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshCompanies}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative inline-block">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                      value={filterStatus}
                      onChange={e =>
                        setFilterStatus(e.target.value as 'all' | 'verified' | 'unverified')
                      }
                    >
                      <option value="all">All Companies</option>
                      <option value="verified">Verified Only</option>
                      <option value="unverified">Unverified Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">No companies found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? `No companies match "${searchTerm}"`
                  : 'There are no companies to display'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map(company => {
                const isExpanded = expandedCompanyId === company.id;
                return (
                  <div
                    key={company.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <img
                            src={getImageUrl(company.logoUrl)}
                            alt={company.companyName}
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            onError={e => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src =
                                'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740';
                            }}
                          />
                          {company.verified && (
                            <span className="absolute -top-1 -right-1 bg-green-100 rounded-full p-0.5">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {company.companyName}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{company.email}</p>
                        </div>
                        <button
                          onClick={e => toggleExpand(company.id, e)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {company.companyType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {company.sector}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{company.industry}</span>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                            {company.tagline && (
                              <p className="italic text-gray-600">"{company.tagline}"</p>
                            )}

                            <div className="flex items-start gap-2">
                              <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Company Details</p>
                                <p className="text-gray-700">
                                  {company.entityType} · Est. {company.incorporationYear}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Website</p>
                                <a
                                  href={company.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {company.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Team Size</p>
                                <p className="text-gray-700">
                                  {company.minEmployeeCount === company.maxEmployeeCount
                                    ? `${company.minEmployeeCount} employees`
                                    : `${company.minEmployeeCount}-${company.maxEmployeeCount} employees`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Deliverables</p>
                                <p className="text-gray-700 line-clamp-2">
                                  {company.deliverableNames}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2">
                              <p className="text-xs text-gray-500">
                                {company.registeredOfficeAddress}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isExpanded && (
                        <button
                          onClick={e => toggleExpand(company.id, e)}
                          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Show details
                        </button>
                      )}

                      <div className="mt-5">
                        <button
                          onClick={e => handleVerify(company.id, e)}
                          disabled={company.verified}
                          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                            company.verified
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
                          }`}
                        >
                          {company.verified ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verified
                            </>
                          ) : (
                            'Verify Company'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SuperAdminCompanyModal
        companyId={selectedCompanyId}
        isOpen={!!selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
      />
    </>
  );
}
