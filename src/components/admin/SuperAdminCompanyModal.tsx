import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, Globe, Tag, MapPin, Boxes, Mail, Link, ChevronRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface CompanyViewProps {
  companyId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Brand {
  id: number;
  brandName: string;
}

interface Company {
  companyName: string;
  tradeName: string;
  logoUrl: string;
  legalName: string;
  companyType: string;
  websiteUrl: string;
  minEmployeeCount: number;
  maxEmployeeCount: number;
  registeredOfficeAddress: string;
  email: string;
  entityType: string;
  industry: string;
  sector: string;
  businessType: string;
  brands: Brand[];
  verified: boolean;
}

export const SuperAdminCompanyModal = ({ companyId, isOpen, onClose }: CompanyViewProps) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;
      
      setLoading(true);
      
      try {
        const adminToken = Cookies.get('admin_token');
        const response = await axios.get(
          `http://localhost:3000/api/v0/company/user-view?id=${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`
            }
          }
        );
        setCompany(response.data);
      } catch (error) {
        toast.error('Failed to fetch company details');
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCompanyDetails();
    }
  }, [companyId, isOpen]);

  const handleVerify = async () => {
    try {
      const adminToken = Cookies.get('admin_token');
      const loadingToastId = toast.loading('Verifying company...');
      
      await axios.put(
        `http://localhost:3000/api/v0/company/verify?companyId=${companyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      toast.dismiss(loadingToastId);
      toast.success('Company verified successfully');
      
      // Update local state
      setCompany(prev => prev ? { ...prev, verified: true } : null);
      
    } catch (error) {
      toast.error('Failed to verify company');
      console.error('Verification error:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
        <div 
          className="flex items-center justify-center min-h-screen px-4 py-8"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Company Details</h2>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading company details...</p>
              </div>
            ) : company ? (
              <div className="divide-y divide-gray-100">
                {/* Company Header */}
                <div className="px-8 py-6 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className="relative w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border-2 border-gray-100 shadow-sm">
                        <img
                          src={`http://localhost:3000/${company.logoUrl}`}
                          alt={company.companyName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Logo';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{company.companyName}</h1>
                        <p className="text-gray-500 mb-4">{company.tradeName}</p>
                        
                        <div className="flex flex-wrap gap-3">
                          {company.websiteUrl && (
                            <a 
                              href={company.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              <Globe className="w-4 h-4 mr-1.5" />
                              Website
                            </a>
                          )}
                          {company.email && (
                            <a 
                              href={`mailto:${company.email}`} 
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              <Mail className="w-4 h-4 mr-1.5" />
                              Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleVerify}
                      disabled={company?.verified}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        company?.verified
                          ? 'bg-green-50 text-green-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      {company?.verified ? 'Verified' : 'Verify Company'}
                    </button>
                  </div>
                  
                  {/* Verification Badge */}
                  {company?.verified && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified Company</span>
                    </div>
                  )}
                </div>

                {/* Company Details */}
                <div className="px-8 py-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <InfoCard title="Company Information">
                        <InfoItem icon={Building2} label="Legal Name" value={company.legalName} />
                        <InfoItem icon={Tag} label="Type" value={company.companyType} />
                        <InfoItem icon={Globe} label="Website" value={company.websiteUrl} isLink />
                        <InfoItem 
                          icon={Users} 
                          label="Team Size" 
                          value={`${company.minEmployeeCount} - ${company.maxEmployeeCount} employees`} 
                        />
                      </InfoCard>

                      <InfoCard title="Location & Contact">
                        <InfoItem icon={MapPin} label="Address" value={company.registeredOfficeAddress} />
                        <InfoItem icon={Mail} label="Email" value={company.email} />
                      </InfoCard>
                    </div>

                    <div className="space-y-6">
                      <InfoCard title="Business Details">
                        <InfoItem icon={Building2} label="Entity Type" value={company.entityType} />
                        <InfoItem icon={Tag} label="Industry" value={company.industry} />
                        <InfoItem icon={Tag} label="Sector" value={company.sector} />
                        <InfoItem icon={Boxes} label="Business Type" value={company.businessType} />
                      </InfoCard>

                      {company.brands && company.brands.length > 0 && (
                        <InfoCard title={`Brands (${company.brands.length})`}>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {company.brands.map((brand) => (
                              <span 
                                key={brand.id} 
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                              >
                                {brand.brandName}
                              </span>
                            ))}
                          </div>
                        </InfoCard>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                <Building2 className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Company details not found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-5 space-y-4">
      {children}
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, isLink = false }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        {isLink && value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
          >
            {value}
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        ) : (
          <p className="font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};