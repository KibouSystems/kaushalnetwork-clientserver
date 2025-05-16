import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Company } from '../../types/company';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatTeardropDots,
  Envelope,
  MagnifyingGlass,
  Buildings,
  MapPin,
  Briefcase,
  FunnelSimple,
  X,
  ArrowClockwise,
  CaretDown,
  CaretUp,
  Heart,
  Star,
  Info,
  ArrowRight,
  Check,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../../components/chat/ChatModal';
import CompanyPreviewDialog from '../../components/company/CompanyPreviewDialog';

// Custom debounce hook
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const arr_of_img = [
  'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-vector/logo-wavy-triangular-shape_1017-1714.jpg?ga=GA1.1.188395480.1746186161&semt=ais_hybrid&w=740',
  'https://img.freepik.com/free-vector/hub-logo-template_23-2149852444.jpg?ga=GA1.1.188395480.1746186161&semt=ais_hybrid&w=740',
];

export default function NetworkPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    keyword: '',
    sector: '',
    location: '',
    companyType: '',
    deliverableNames: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage, setCompaniesPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('list');
  const [showFutureFeatureToast, setShowFutureFeatureToast] = useState(false);
  const [futureFeatureMessage, setFutureFeatureMessage] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedParams = useDebounce(queryParams, 2000);
  const [selectedChat, setSelectedChat] = useState<{ id: number; name: string } | null>(null);
  const [previewCompany, setPreviewCompany] = useState<Company | null>(null);

  // Calculate current companies to display based on pagination
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  // Calculate total pages
  const totalPages = Math.ceil(companies.length / companiesPerPage);

  // Helper function to display notifications about upcoming features
  const notifyFutureFeature = (feature: string) => {
    setFutureFeatureMessage(`${feature} will be available in a future update`);
    setShowFutureFeatureToast(true);
    setTimeout(() => setShowFutureFeatureToast(false), 3000);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, current page and one page before/after current page
      if (currentPage <= 3) {
        // Current page is close to beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is close to end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Current page is in the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        setLoading(true);

        const params = new URLSearchParams();
        Object.entries(debouncedParams).forEach(([key, value]) => {
          if (value !== '' && value !== null) {
            params.append(key, value.toString());
          }
        });

        const response = await axios.get(
          `http://localhost:3000/api/v0/company/all?${params.toString()}`,
          { signal: abortControllerRef.current.signal }
        );

        setCompanies(response.data);
      } catch (error: any) {
        if (error.name === 'CanceledError') {
          // Ignore canceled requests
          return;
        }
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();

    // Cleanup function to cancel pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedParams]);

  // Handle window resize for responsive companiesPerPage
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // mobile
        setCompaniesPerPage(3);
      } else if (width < 1024) {
        // tablet
        setCompaniesPerPage(4);
      } else {
        // desktop
        setCompaniesPerPage(5);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Make sure the handleCardClick function is properly implemented
  const handleCardClick = (company: Company, e: React.MouseEvent) => {
    // Prevent triggering when clicking buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    setPreviewCompany(company);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setQueryParams({
      keyword: '',
      sector: '',
      location: '',
      companyType: '',
      deliverableNames: '',
    });
  };

  const handleChatClick = (company: Company) => {
    notifyFutureFeature('Company chat');
    // setSelectedChat({ id: company.id, name: company.companyName });
  };

  const handleSaveSearch = () => {
    notifyFutureFeature('Save search');
  };

  const handleExport = () => {
    notifyFutureFeature('Export functionality');
  };

  const CompanyCard = ({ company }: { company: Company }) => (
    <motion.div
      onClick={e => handleCardClick(company, e)}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border ${
        company.verified ? 'border-blue-100' : 'border-gray-200'
      }`}
    >
      <div className={`h-1.5 ${company.verified ? 'bg-blue-500' : 'bg-gray-200'}`}></div>

      {activeView === 'list' ? (
        <div className="flex flex-col sm:flex-row p-4">
          <div className="sm:mr-4 mb-4 sm:mb-0 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src={
                  company.logoUrl &&
                  (company.logoUrl.startsWith('http://') || company.logoUrl.startsWith('https://'))
                    ? company.logoUrl
                    : `http://localhost:3000/${company.logoUrl}`
                }
                alt={company.companyName}
                className="object-cover max-h-full max-w-full"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    arr_of_img[Math.floor(Math.random() * arr_of_img.length)];
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                    {company.companyName}
                  </h3>
                  {company.verified && (
                    <span className="ml-2 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <Check weight="bold" className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs font-medium text-gray-600 mb-2">
                  <Buildings className="w-3 h-3 mr-1 text-gray-400" />
                  <span className="truncate">{company.sector}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{company.industry}</span>
                </div>
              </div>
              <div className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700">
                {company.companyType}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm my-2">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 truncate">{company.registeredOfficeAddress}</span>
              </div>
              <div className="flex items-start">
                <Briefcase className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 truncate">{company.deliverableNames}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleChatClick(company)}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ChatTeardropDots className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Chat</span>
                </button>
                <button
                  onClick={() => notifyFutureFeature('Email functionality')}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Envelope className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Mail</span>
                </button>
                <button
                  onClick={() => notifyFutureFeature('Save to favorites')}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>
              <Button
                size="sm"
                onClick={() => navigate(`/company/${company.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Grid view layout
        <div className="p-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src={
                  company.logoUrl &&
                  (company.logoUrl.startsWith('http://') || company.logoUrl.startsWith('https://'))
                    ? company.logoUrl
                    : `http://localhost:3000/${company.logoUrl}`
                }
                alt={company.companyName}
                className="object-cover max-h-full max-w-full"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    arr_of_img[Math.floor(Math.random() * arr_of_img.length)];
                }}
              />
            </div>
          </div>

          <div className="text-center mb-3">
            <h3 className="font-bold text-gray-900 mb-1">{company.companyName}</h3>
            <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
              <Buildings className="w-3 h-3 mr-1" />
              <span className="truncate">{company.sector}</span>
            </div>
            {company.verified && (
              <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>

          <div className="mb-4 text-center">
            <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 inline-block">
              {company.companyType}
            </span>
          </div>

          <div className="space-y-2 text-xs text-center">
            <div className="flex items-center justify-center">
              <MapPin className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
              <span className="text-gray-700 truncate">{company.registeredOfficeAddress.substring(0, 25)}...</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => navigate(`/company/${company.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs w-full"
            >
              View Profile
            </Button>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => handleChatClick(company)}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ChatTeardropDots className="w-4 h-4" />
              </button>
              <button
                onClick={() => notifyFutureFeature('Email functionality')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Envelope className="w-4 h-4" />
              </button>
              <button
                onClick={() => notifyFutureFeature('Save to favorites')}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Coming Soon Feature Banner */}
      <AnimatePresence>
        {showFutureFeatureToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          >
            <Info className="w-5 h-5 mr-2" />
            <span>{futureFeatureMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-8 md:py-10 max-w-3xl relative">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Business Network
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                Connect with verified businesses and potential partners across India
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-grow">
                  <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company name, products, or services..."
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    onChange={e => setQueryParams(prev => ({ ...prev, keyword: e.target.value }))}
                    value={queryParams.keyword}
                  />
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white text-blue-700 hover:bg-blue-50 transition-all flex items-center gap-2 px-5 py-3 font-medium rounded-full shadow-md"
                >
                  <FunnelSimple className="w-5 h-5" />
                  <span className="hidden sm:inline">Advanced Filters</span>
                  <span className="sm:hidden">Filters</span>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-xs font-medium text-blue-100">Popular searches:</span>
                {['IT Services', 'Manufacturing', 'Export', 'Healthcare', 'Consulting'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQueryParams(prev => ({ ...prev, keyword: term }))}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <FunnelSimple className="w-5 h-5 mr-2 text-blue-600" />
                  Advanced Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Industry Sector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Sector
                    </label>
                    <select
                      className="w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      value={queryParams.sector}
                      onChange={e => setQueryParams(prev => ({ ...prev, sector: e.target.value }))}
                    >
                      <option value="">All Sectors</option>
                      <option value="IT">Information Technology</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance & Banking</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="City, State or Country"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={queryParams.location}
                      onChange={e => setQueryParams(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      className="w-full py-2 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                      value={queryParams.companyType}
                      onChange={e => setQueryParams(prev => ({ ...prev, companyType: e.target.value }))}
                    >
                      <option value="">All Types</option>
                      <option value="MSME">MSME</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Bank">Bank/NBFC</option>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Products/Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Products/Services
                    </label>
                    <input
                      type="text"
                      placeholder="Enter products or services"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={queryParams.deliverableNames}
                      onChange={e =>
                        setQueryParams(prev => ({ ...prev, deliverableNames: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="py-1.5 px-3 text-sm border-gray-300 text-gray-600 flex items-center gap-1"
                    >
                      <ArrowClockwise className="w-4 h-4" />
                      Clear Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveSearch}
                      className="py-1.5 px-3 text-sm border-gray-300 text-gray-600 flex items-center gap-1"
                    >
                      <Star className="w-4 h-4" />
                      Save Search
                    </Button>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 py-1.5 px-4 text-sm shadow-sm"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info & Layout Controls */}
        {!loading && companies.length > 0 && (
          <div className="flex flex-wrap justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              <span className="font-semibold text-gray-900">{companies.length}</span> businesses found
              {totalPages > 1 && (
                <span className="ml-2">
                  (Showing {indexOfFirstCompany + 1}-
                  {Math.min(indexOfLastCompany, companies.length)} of {companies.length})
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">View:</span>
                <div className="inline-flex border rounded-md overflow-hidden">
                  <button
                    onClick={() => setActiveView('grid')}
                    className={`p-1.5 ${
                      activeView === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                    title="Grid View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" />
                      <path d="M13 3a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V3z" />
                      <path d="M3 13a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                      <path d="M13 13a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveView('list')}
                    className={`p-1.5 ${
                      activeView === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                    title="List View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort:</span>
                <select className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Relevance</option>
                  <option>Newest First</option>
                  <option>A to Z</option>
                </select>
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                className="py-1 px-3 text-xs sm:text-sm border-gray-300 text-gray-600 hidden sm:flex items-center gap-1"
              >
                Export
              </Button>
            </div>
          </div>
        )}

        {/* Coming Soon Feature Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-1 mt-0.5">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 text-sm">Advanced Features Coming Soon</h3>
            <p className="text-blue-700 text-xs mt-1">
              Email, chat functionality, favorites, and advanced filtering options will be available in future updates.
            </p>
          </div>
        </div>

        {/* Results Grid or List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="inline-block mx-auto mb-6 w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-gray-600">Searching India's leading business directory...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        ) : (
          <AnimatePresence>
            {companies.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-4 ${
                  activeView === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {currentCompanies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-10 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlass size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  We couldn't find businesses matching your search criteria. Try adjusting your
                  filters or browsing our categories.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['IT', 'Manufacturing', 'Healthcare', 'Finance', 'Retail'].map(sector => (
                    <Button
                      key={sector}
                      variant="outline"
                      className="border-gray-200 text-gray-700"
                      onClick={() => setQueryParams(prev => ({ ...prev, sector, keyword: '' }))}
                    >
                      {sector}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Enhanced Pagination */}
        {!loading && companies.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center">
            <nav className="flex justify-center items-center">
              <ul className="flex flex-wrap items-center">
                {/* Previous page button */}
                <li>
                  <button
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md border ${
                      currentPage === 1
                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    } mr-1`}
                    aria-label="Previous page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </li>

                {/* Page numbers */}
                {getPageNumbers().map((number, index) => (
                  <li key={index}>
                    {number === '...' ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(number as number)}
                        className={`w-9 h-9 flex items-center justify-center rounded-md mx-1 ${
                          number === currentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    )}
                  </li>
                ))}

                {/* Next page button */}
                <li>
                  <button
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border ${
                      currentPage === totalPages
                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    } ml-1`}
                    aria-label="Next page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="text-center mt-3 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedChat && (
        <ChatModal
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          recipientName={selectedChat.name}
          recipientId={selectedChat.id}
        />
      )}
      <CompanyPreviewDialog
        companyId={previewCompany?.id}
        isOpen={!!previewCompany}
        onClose={() => setPreviewCompany(null)}
      />
    </div>
  );
}
