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
const NetworkPage = () => {
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedParams = useDebounce(queryParams, 2000); // Debounce all params by 500ms
  const [selectedChat, setSelectedChat] = useState<{ id: number; name: string } | null>(null);

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

  const CompanyCard = ({ company }: { company: Company }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.97 }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-400 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center space-x-4">
          <motion.img
            src={`http://localhost:3000/${company.logoUrl}`}
            alt={company.companyName}
            className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = arr_of_img[Math.floor(Math.random() * arr_of_img.length)]; // existing fallback
            }}
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {company.companyName}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Buildings className="w-4 h-4" />
              {company.sector} • {company.industry}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 text-sm border-b bg-white">
        {[
          { 
            icon: ChatTeardropDots, 
            label: "Chat",
            onClick: () => setSelectedChat({ id: company.id, name: company.companyName })
          },
          { icon: Envelope, label: "Mail" },
          { icon: Calendar, label: "Schedule" }
        ].map((item, index) => (
          <motion.button
            key={index}
            onClick={item.onClick}
            whileHover={{ backgroundColor: "#EEF2FF" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-3 space-x-2 transition-all"
          >
            <item.icon weight="duotone" className="w-5 h-5 text-indigo-500" />
            <span className="font-medium text-gray-700">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Company Details */}
      <div className="p-6 space-y-4 bg-gradient-to-br from-white to-blue-50/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 flex items-center gap-1"><Briefcase className="w-4 h-4" />Type</p>
            <p className="font-medium">{company.companyType}</p>
          </div>
          <div>
            <p className="text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" />Location</p>
            <p className="font-medium">{company.registeredOfficeAddress}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 flex items-center gap-1"><Users className="w-4 h-4" />Products/Services</p>
            <p className="font-medium">{company.deliverableNames}</p>
          </div>
        </div>
        <motion.div
          className="flex space-x-2 pt-2"
          initial={false}
          whileHover={{ gap: 12 }}
        >
          <Button 
            size="sm" 
            variant="outline" 
            className="transition-all"
            onClick={() => navigate(`/company/${company.id}`)}
          >
            View Profile
          </Button>
          <Button size="sm" variant="outline" className="transition-all">Send Query</Button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                onChange={(e) => setQueryParams(prev => ({ ...prev, keyword: e.target.value }))}
              />
            </div>
            <div>
              <select
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                onChange={(e) => setQueryParams(prev => ({ ...prev, sector: e.target.value }))}
              >
                <option value="">Select Sector</option>
                <option value="IT">IT</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter Location"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                onChange={(e) => setQueryParams(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <select
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                onChange={(e) => setQueryParams(prev => ({ ...prev, companyType: e.target.value }))}
              >
                <option value="">Company Type</option>
                <option value="MSME">MSME</option>
                <option value="Corporate">Corporate</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Bank">Bank</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Product/Service"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                onChange={(e) => setQueryParams(prev => ({ ...prev, deliverableNames: e.target.value }))}
              />
            </div>
          </div>
        </motion.div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
            />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && companies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            No companies found matching your search criteria.
          </motion.div>
        )}
      </div>
      {selectedChat && (
        <ChatModal
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          recipientName={selectedChat.name}
          recipientId={selectedChat.id}
        />
      )}
    </div>
  );
};

export default NetworkPage;
