import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Company } from '../../types/company';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatTeardropDots,
  Envelope,
  Calendar,
  MagnifyingGlass,
  Buildings,
  MapPin,
  Briefcase,
  Users
} from "@phosphor-icons/react";
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

const arr_of_img = ["https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/logo-wavy-triangular-shape_1017-1714.jpg?ga=GA1.1.188395480.1746186161&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/hub-logo-template_23-2149852444.jpg?ga=GA1.1.188395480.1746186161&semt=ais_hybrid&w=740"

]
export default function NetworkPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    keyword: '',
    sector: '',
    location: '',
    companyType: '',
    deliverableNames: ''
  });
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;
  
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

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
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

  // Make sure the handleCardClick function is properly implemented
  const handleCardClick = (company: Company, e: React.MouseEvent) => {
    // Prevent triggering when clicking buttons or links
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    setPreviewCompany(company);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CompanyCard = ({ company }: { company: Company }) => (
    <motion.div
      onClick={(e) => handleCardClick(company, e)}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-md shadow-md overflow-hidden border-l-4 border-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex p-4">
        <div className="mr-4">
          <div className="w-20 h-20 bg-white rounded-md border border-gray-200 overflow-hidden flex items-center justify-center">
            <img
              src={company.logoUrl && (company.logoUrl.startsWith('http://') || company.logoUrl.startsWith('https://')) 
                ? company.logoUrl 
                : `http://localhost:3000/${company.logoUrl}`}
              alt={company.companyName}
              className="object-cover max-h-full max-w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = arr_of_img[Math.floor(Math.random() * arr_of_img.length)];
              }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                {company.companyName}
              </h3>
              <div className="flex items-center text-xs font-medium text-gray-600 mb-2">
                <Buildings className="w-3 h-3 mr-1" />
                <span className="truncate">{company.sector}</span>
                <span className="mx-1">•</span>
                <span className="truncate">{company.industry}</span>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-sm font-semibold">
              {company.companyType}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm my-2">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 truncate">{company.registeredOfficeAddress}</span>
            </div>
            <div className="flex items-start">
              <Briefcase className="w-4 h-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 truncate">{company.deliverableNames}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex space-x-3">
              <button 
                onClick={() => setSelectedChat({ id: company.id, name: company.companyName })}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <ChatTeardropDots className="w-4 h-4 mr-1" />
                <span>Chat</span>
              </button>
              <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                <Envelope className="w-4 h-4 mr-1" />
                <span>Mail</span>
              </button>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/company/${company.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Business Directory</h1>
              <p className="text-gray-600">Find and connect with verified business partners across India</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 py-1 px-3 text-sm font-medium">
                Export Results
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 text-sm font-medium">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Filters Section */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Advanced Search Filters</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                <div className="relative">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter keywords..."
                    className="w-full pl-9 pr-3 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={(e) => setQueryParams(prev => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Industry Sector</label>
                <select
                  className="w-full py-2 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={(e) => setQueryParams(prev => ({ ...prev, sector: e.target.value }))}
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
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="City, State or Country"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={(e) => setQueryParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  className="w-full py-2 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={(e) => setQueryParams(prev => ({ ...prev, companyType: e.target.value }))}
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
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Products/Services</label>
                <input
                  type="text"
                  placeholder="Enter products or services"
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onChange={(e) => setQueryParams(prev => ({ ...prev, deliverableNames: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="py-1 px-4 text-sm border-gray-300 text-gray-600">
                  Clear All
                </Button>
                <Button variant="outline" className="py-1 px-4 text-sm border-gray-300 text-gray-600">
                  Save Search
                </Button>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-6 text-sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Stats & Controls */}
        {!loading && companies.length > 0 && (
          <div className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{companies.length}</span> businesses found
              {totalPages > 1 && (
                <span className="ml-2">
                  (Showing {indexOfFirstCompany + 1}-{Math.min(indexOfLastCompany, companies.length)} of {companies.length})
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Relevance</option>
                  <option>Newest First</option>
                  <option>A to Z</option>
                </select>
              </div>
              <div className="flex border rounded overflow-hidden">
                <button className="p-1.5 bg-gray-50 border-r">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                    <path d="M2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-1.5 bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Grid */}
        {loading ? (
          <div className="bg-white rounded-md shadow-md border border-gray-200 p-12 text-center">
            <div className="inline-block mx-auto mb-6 w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-gray-600">Searching India's leading business directory...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        ) : (
          <AnimatePresence>
            {companies.length > 0 ? (
              <motion.div
                layout
                className="grid gap-4"
              >
                {currentCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-md shadow-md border border-gray-200 p-10 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlass size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  We couldn't find businesses matching your search criteria. Try adjusting your filters or browsing our categories.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["IT", "Manufacturing", "Healthcare", "Finance", "Retail"].map(sector => (
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
        
        {/* Enhanced Pagination - Show when we have companies and more than one page */}
        {!loading && companies.length > 0 && totalPages > 1 && (
          <div className="mt-6">
            <nav className="flex justify-center items-center">
              <ul className="flex items-center space-x-1">
                {/* Previous page button */}
                <li>
                  <button
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded border ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </li>
                
                {/* Page numbers */}
                {getPageNumbers().map(number => (
                  <li key={number}>
                    <button
                      onClick={() => handlePageChange(number)}
                      className={`px-4 py-2 rounded ${
                        number === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                
                {/* Next page button */}
                <li>
                  <button
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded border ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
            
            {/* Page info */}
            <div className="text-center mt-2 text-sm text-gray-500">
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
};
