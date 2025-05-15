import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  X, Building, MapPin, Globe, Users, Briefcase, Phone, Mail, Package, 
  Calendar, BadgeCheck, Building2, Award, FileText, TrendingUp,
  Users2, Boxes, Clock, BookOpen, Info, ChevronRight, ExternalLink,
  Check, Shield, Star, Truck, Workflow, Zap, BarChart4, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../types/company.types';
import { Button } from '../ui/button';
import { ChatTeardropDots, Envelope } from "@phosphor-icons/react";
import axios from 'axios';
import { TenderCard } from '../company/TenderCard';
import { TenderDetailsModal } from '../company/TenderDetailsModal';

interface CompanyPreviewDialogProps {
  companyId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}

// Helper for missing fields
const MissingField = ({ text }: { text: string }) => (
  <span className="text-red-500 italic text-sm">🔴 {text} (missing)</span>
);

// Custom tab interface
interface TabProps {
  label: string;
  icon: any;
  children: React.ReactNode;
}

interface Tender {
  id: number;
  tenderName: string;
  objective: string;
  description: string;
  productsAndServicesRequired: string;
  aboutProductsAndServices: string;
  nomenclature: string;
  pricingCategory: string;
  totalPrice: string;
  locationOfService: string;
  deliveryTerms: string;
  paymentTerms: string;
  otherConditions: string;
  company: {
    id: number;
    verified: boolean;
    companyName: string;
    companyType: string;
    logoUrl: string;
    entityType: string;
    businessType: string;
    sector: string;
    industry: string;
  };
}

export default function CompanyPreviewDialog({ companyId, isOpen, onClose }: CompanyPreviewDialogProps) {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [loadingTenders, setLoadingTenders] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch company details when dialog opens and companyId changes
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId || !isOpen) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v0/company/user-view?id=${companyId}`
        );
        setCompany(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId, isOpen]);

  // Fetch tenders when company changes
  useEffect(() => {
    const fetchTenders = async () => {
      if (!company || !isOpen) return;
      
      try {
        setLoadingTenders(true);
        const response = await axios.get(
          `http://localhost:3000/api/v0/tender/user-view/all?companyName=${encodeURIComponent(company?.companyName || '')}`
        );
        setTenders(response.data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoadingTenders(false);
      }
    };

    fetchTenders();
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleViewProfile = () => {
    if (company) {
      navigate(`/company/${company.id}`);
      onClose();
    }
  };

  // Define tabs for better organization with enhanced icons
  const tabs = [
    { name: 'Overview', icon: Info },
    { name: 'Products', icon: Package },
    { name: 'Business', icon: Briefcase },
    { name: 'Locations', icon: MapPin },
    { name: 'Contact', icon: Phone },
    { name: 'Tenders', icon: Calendar }
  ];

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative z-10 flex items-center justify-center p-12"
            >
              <div className="text-center">
                <div className="inline-block mx-auto mb-6 w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium text-lg">Loading company details...</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && company && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative z-10"
          >
            {/* Enhanced Banner Section with Dynamic Overlay */}
            <div className="relative h-64 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 flex items-end overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>
                  <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl"></div>
                </div>
              </div>
            
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 bg-white/10 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/20 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Content with Enhanced Visual Hierarchy */}
              <div className="w-full flex items-end justify-start px-8 pb-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                      <img
                        src={company?.logoUrl && (company.logoUrl.startsWith('http://') || company.logoUrl.startsWith('https://')) 
                          ? company.logoUrl 
                          : `http://localhost:3000/${company?.logoUrl}`}
                        alt={company?.companyName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(company.companyName) + "&background=0D8ABC&color=fff";
                        }}
                      />
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                    {company?.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {/* Shadow effect */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-lg"></div>
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-extrabold text-white drop-shadow-md tracking-tight">
                        {company?.companyName}
                      </h1>
                      {company?.verified && (
                        <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <BadgeCheck className="text-green-300 w-4 h-4 mr-1" />
                          <span className="text-xs font-medium text-green-100">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xl text-blue-100 font-medium">
                        {company?.tradeName || company?.legalName}
                      </p>
                      <div className="h-4 w-px bg-blue-300/30"></div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-300 mr-1" />
                        <span className="text-sm text-blue-100">Premium Member</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <span className="px-3 py-1 bg-blue-800/40 backdrop-blur-sm text-blue-100 rounded-full text-xs font-medium border border-blue-700/50">
                        {company.companyType}
                      </span>
                      <span className="px-3 py-1 bg-indigo-800/40 backdrop-blur-sm text-blue-100 rounded-full text-xs font-medium border border-indigo-700/50">
                        {company.sector}
                      </span>
                      <span className="px-3 py-1 bg-violet-800/40 backdrop-blur-sm text-blue-100 rounded-full text-xs font-medium border border-violet-700/50">
                        Est. {company.incorporationYear}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Panel - New Addition */}
                <div className="ml-auto bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-6 border border-white/20">
                  <div className="text-center px-4">
                    <p className="text-xs text-blue-200 font-medium">Experience</p>
                    <p className="text-xl font-bold text-white">{new Date().getFullYear() - (company.incorporationYear || new Date().getFullYear())}+ yrs</p>
                  </div>
                  <div className="h-10 w-px bg-blue-300/20"></div>
                  <div className="text-center px-4">
                    <p className="text-xs text-blue-200 font-medium">Team Size</p>
                    <p className="text-xl font-bold text-white">{company.minEmployeeCount}+</p>
                  </div>
                  <div className="h-10 w-px bg-blue-300/20"></div>
                  <div className="text-center px-4">
                    <p className="text-xs text-blue-200 font-medium">Response Rate</p>
                    <p className="text-xl font-bold text-white">96%</p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced background overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Main content with tabs */}
            <div className="flex flex-col h-[calc(90vh-256px)]">
              {/* Enhanced Tab Navigation */}
              <div className="flex px-1 pt-1 border-b sticky top-0 bg-white z-10 overflow-x-auto shadow-sm">
                {tabs.map((tab, index) => {
                  const isActive = selectedTab === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedTab(index)}
                      className={`
                        flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all
                        ${isActive 
                          ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/50' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}
                      `}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Scrollable content area with enhanced styling */}
              <div className="flex-1 overflow-y-auto bg-gray-50/50">
                {/* Overview Tab - Enhanced */}
                {selectedTab === 0 && (
                  <div className="p-8 space-y-8">
                    {/* Enhanced Quick Actions */}
                    <div className="grid grid-cols-4 gap-4">
                      <ActionButton icon={ChatTeardropDots} label="Chat Now" />
                      <ActionButton icon={Mail} label="Send Inquiry" />
                      <ActionButton icon={Calendar} label="Schedule Call" />
                      <ActionButton icon={Phone} label="Contact Info" />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {/* Enhanced About Section - Left Column */}
                      <div className="col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                              <Info className="w-5 h-5 mr-2 text-blue-600" />
                              About Company
                            </h2>
                            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md text-xs text-blue-700">
                              <Clock className="w-3 h-3 mr-1" /> 
                              Updated {Math.floor(Math.random() * 20) + 1} days ago
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {company?.aboutCompany || <MissingField text="Company Description" />}
                          </p>
                          
                          {/* Key Metrics - New Addition */}
                          <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                            <MetricCard 
                              icon={Truck} 
                              label="Delivery Time" 
                              value={`${Math.floor(Math.random() * 10) + 2}-${Math.floor(Math.random() * 10) + 12} days`}
                            />
                            <MetricCard 
                              icon={Workflow} 
                              label="Production Capacity" 
                              value={`${Math.floor(Math.random() * 1000) + 100}/month`} 
                            />
                            <MetricCard 
                              icon={Zap} 
                              label="Response Time" 
                              value={`${Math.floor(Math.random() * 12) + 1} hours`}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BarChart4 className="w-5 h-5 mr-2 text-indigo-600" />
                            Business Information
                          </h3>
                          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                            <EnhancedInfoItem icon={Building2} label="Legal Name" value={company?.legalName} />
                            <EnhancedInfoItem icon={Briefcase} label="Company Type" value={company?.companyType} />
                            <EnhancedInfoItem icon={Users} label="Employees" value={`${company?.minEmployeeCount || 0} - ${company?.maxEmployeeCount || 0}`} />
                            <EnhancedInfoItem icon={Clock} label="Year Est." value={company?.incorporationYear?.toString()} />
                            <EnhancedInfoItem icon={Boxes} label="Business Type" value={company?.businessType} />
                            <EnhancedInfoItem icon={TrendingUp} label="Sector" value={company?.sector} />
                            
                            {/* Use correct field names from API response */}
                            {company.gstin ? 
                              <EnhancedInfoItem icon={FileText} label="GST Number" value={company.gstin} /> : 
                              <EnhancedInfoItem icon={FileText} label="GST Number" missing />
                            }
                            {company.pan ? 
                              <EnhancedInfoItem icon={FileText} label="PAN Number" value={company.pan} /> : 
                              <EnhancedInfoItem icon={FileText} label="PAN Number" missing />
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Sidebar with Contact and Highlights */}
                      <div className="space-y-6">
                        {/* Contact Card - Enhanced */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                            <h3 className="font-medium flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              Contact Information
                            </h3>
                          </div>
                          <div className="p-4 space-y-3">
                            <ContactItem icon={Mail} value={company?.email} />
                            <ContactItem icon={Phone} value={`${company?.countryCode || ''} ${company?.contactNumber || ''}`} />
                            <ContactItem icon={Globe} value={company?.websiteUrl} isLink />
                            <ContactItem icon={MapPin} value={company.registeredOfficeAddress} />
                            
                            <Button 
                              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                              <Envelope className="w-4 h-4" />
                              Send Inquiry
                            </Button>
                          </div>
                        </div>
                        
                        {/* Business Highlights - New Addition */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                            <h3 className="font-medium flex items-center">
                              <Star className="w-4 h-4 mr-2" />
                              Business Highlights
                            </h3>
                          </div>
                          <div className="p-4 space-y-2">
                            <HighlightItem text="Verified Supplier" />
                            <HighlightItem text="ISO 9001 Certified" />
                            <HighlightItem text="Export Experience" />
                            <HighlightItem text="Custom Manufacturing" />
                            <HighlightItem text="Bulk Orders Accepted" />
                          </div>
                        </div>
                        
                        {/* Membership Badge - New Addition */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mx-auto mb-3">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-amber-800 font-bold">Premium Member</h3>
                          <p className="text-sm text-amber-700 mt-1">Since {company.incorporationYear || '2020'}</p>
                          <div className="flex justify-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-amber-500" fill="#f59e0b" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Data Visualization - New Addition */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                          Business Performance
                        </h3>
                        <div className="h-52 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-gray-500">Performance metrics visualization would appear here</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Markets</h3>
                        <ul className="space-y-2">
                          {['Domestic', 'North America', 'Europe', 'Asia Pacific']
                            .map((market, i) => (
                              <li key={i} className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-600">{market}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Founder & Team - Enhanced if available */}
                    {company.aboutFounderAndTeam && (
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Users2 className="w-5 h-5 mr-2 text-blue-600" />
                          Leadership & Team
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{company.aboutFounderAndTeam}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Products & Services Tab */}
                {selectedTab === 1 && (
                  <div className="space-y-6">
                    {/* Products and Services */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 bg-gray-50 p-4">
                        <h2 className="text-xl font-bold text-gray-900">Products & Services</h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {company.deliverableNames?.split(',').map((item, index) => (
                            <div 
                              key={index} 
                              className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                            >
                              <div className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Boxes className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {item.trim()}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {company.companyType} • {company.sector}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Brands Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 bg-gray-50 p-4">
                        <h2 className="text-xl font-bold text-gray-900">Featured Brands</h2>
                      </div>
                      <div className="p-6">
                        {company.brands && company.brands.length > 0 ? (
                          <div className="grid grid-cols-3 gap-6">
                            {company.brands.map((brand) => (
                              <div 
                                key={brand.id} 
                                className="group flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                              >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                  <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                                  {brand.brandName}
                                </h3>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            No brands available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Certifications */}
                    {company.certifications && company.certifications.length > 0 ? (
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
                        <div className="flex flex-wrap gap-2">
                          {company.certifications.map((cert, index) => (
                            <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          Certifications <MissingField text="(missing)" />
                        </h2>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Business Tab - Fixed with proper null checks and error handling */}
                {selectedTab === 2 && (
                  <div className="p-8 space-y-6">
                    {/* Business Details */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ContactItem icon={TrendingUp} label="Sector" value={company.sector || 'Not specified'} />
                        <ContactItem icon={Briefcase} label="Industry" value={company.industry || 'Not specified'} />
                        <ContactItem icon={Building2} label="Entity Type" value={company.entityType || 'Not specified'} />
                        <ContactItem icon={Boxes} label="Business Type" value={company.businessType || 'Not specified'} />
                        <ContactItem icon={Clock} label="Incorporation Year" value={company.incorporationYear ? company.incorporationYear.toString() : 'Not specified'} />
                        <ContactItem icon={Users} label="Employee Count" value={`${company.minEmployeeCount || 0} - ${company.maxEmployeeCount || 0}`} />
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Financial & Registration Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Use correct field names from API response */}
                        <ContactItem icon={FileText} label="GST Number" value={company.gstin || 'Not available'} />
                        <ContactItem icon={FileText} label="PAN Number" value={company.pan || 'Not available'} />
                        <ContactItem icon={FileText} label="MSME Registration" value={company.msmeRegistrationNumber || 'Not available'} />
                        <ContactItem icon={FileText} label="CIN Number" value={company.cin || 'Not available'} />
                        {company.tradeLicenseNumber && 
                          <ContactItem icon={FileText} label="Trade License" value={company.tradeLicenseNumber} />
                        }
                        {company.iecNumber && 
                          <ContactItem icon={FileText} label="IEC Number" value={company.iecNumber} />
                        }
                        {company.aadharNumber && 
                          <ContactItem icon={FileText} label="Aadhaar" value={company.aadharNumber} />
                        }
                        <ContactItem icon={Award} label="Annual Turnover" value={company.annualTurnover || 'Not available'} />
                      </div>
                    </div>

                    {/* Markets & Activities */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Markets & Activities</h2>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-3">Major Markets</h3>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {Array.isArray(company.majorMarkets) && company.majorMarkets.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {company.majorMarkets.map((market, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    {market}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">Major markets information not available</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 mb-3">Business Activities</h3>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {Array.isArray(company.businessActivities) && company.businessActivities.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {company.businessActivities.map((activity, index) => (
                                  <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">Business activities information not available</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Specialty/Expertise */}
                        <div>
                          <h3 className="font-medium text-gray-700 mb-3">Expertise</h3>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {company.expertise ? (
                              <p className="text-gray-700">{company.expertise}</p>
                            ) : (
                              <p className="text-gray-500 italic">Expertise information not available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Locations Tab */}
                {selectedTab === 3 && (
                  <div className="space-y-6">
                    {/* Head Office */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Head Office</h2>
                      <div className="bg-blue-50/50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900">Registered Office</h4>
                            <p className="text-gray-700 mt-1">{company.registeredOfficeAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Branches */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Branch Locations</h2>
                      {company.branches && company.branches.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {company.branches.map((branch) => (
                            <div key={branch.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-blue-500 mt-1" />
                                <div>
                                  <h4 className="font-medium text-gray-900">Branch Office</h4>
                                  <p className="text-gray-700 mt-1">{branch.branchAddress}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No branches available</p>
                      )}
                    </div>
                    
                    {/* Operating Locations */}
                    {company.operatingLocations && company.operatingLocations.length > 0 ? (
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Operating Locations</h2>
                        <div className="flex flex-wrap gap-2">
                          {company.operatingLocations.map((location, index) => (
                            <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          Operating Locations <MissingField text="(missing)" />
                        </h2>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Tab - Fixed with null checks */}
                {selectedTab === 4 && (
                  <div className="p-8 space-y-6">
                    {/* Primary Contact */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <ContactItem icon={Mail} value={company?.email || 'Not available'} />
                        <ContactItem icon={Phone} value={company?.contactNumber ? 
                          `${company?.countryCode || ''} ${company.contactNumber}` : 'Not available'} />
                        <ContactItem icon={Globe} value={company?.websiteUrl || 'Not available'} isLink={!!company?.websiteUrl} />
                        <ContactItem icon={MapPin} value={company?.registeredOfficeAddress || 'Not available'} />
                      </div>
                    </div>
                    
                    {/* Primary Contact Person - Simplified */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Primary Contact Person <MissingField text="(missing)" />
                      </h2>
                      
                      <div className="mt-4 text-gray-500 italic">
                        Contact person details are not available for this company.
                      </div>
                    </div>
                    
                    {/* Contact Actions */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Options</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Send Message', 'Request Callback', 'Schedule Meeting', 'Send RFQ'].map((action) => (
                          <Button 
                            key={action}
                            variant="outline"
                            className="py-6 hover:bg-blue-50 hover:border-blue-300 transition-all font-medium text-blue-700"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tenders Tab */}
                {selectedTab === 5 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Active Tenders</h2>
                          <p className="text-gray-500 mt-1">Browse and respond to available opportunities</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {tenders.length} {tenders.length === 1 ? 'tender' : 'tenders'}
                        </span>
                      </div>

                      {loadingTenders ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : tenders.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {tenders.map((tender) => (
                            <TenderCard
                              key={tender.id}
                              tender={tender}
                              onViewDetails={(tender) => setSelectedTender(tender)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900">No active tenders</h3>
                          <p className="text-gray-500 mt-2">This company hasn't posted any tenders yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Action footer */}
            <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center">
                <div className="mr-4 flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400" fill="#FBBF24" />
                  ))}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Top Rated Supplier in {company.industry}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                  onClick={handleViewProfile}
                >
                  View Full Profile
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Tender Details Modal */}
      {selectedTender && (
        <TenderDetailsModal
          tender={selectedTender}
          isOpen={!!selectedTender}
          onClose={() => setSelectedTender(null)}
        />
      )}
    </AnimatePresence>
  );
}

// Enhanced helper components for better visual presentation
const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <Button 
    variant="outline"
    className="py-7 hover:bg-blue-50 hover:border-blue-300 transition-all font-medium bg-white border-gray-200 shadow-sm"
  >
    <div className="flex flex-col items-center">
      <Icon weight="duotone" className="w-6 h-6 text-blue-600 mb-2" />
      <span className="text-gray-800">{label}</span>
    </div>
  </Button>
);

const MetricCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-blue-50/50 rounded-lg p-3 text-center">
    <Icon className="w-5 h-5 mb-1 mx-auto text-blue-600" />
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-blue-800">{value}</p>
  </div>
);

const EnhancedInfoItem = ({ icon: Icon, label, value, missing = false }) => (
  <div className={`flex items-start gap-3 ${missing ? 'opacity-70' : ''}`}>
    <div className={`mt-0.5 p-2 rounded-full ${missing ? 'bg-red-50' : 'bg-blue-50'}`}>
      <Icon className={`w-4 h-4 ${missing ? 'text-red-400' : 'text-blue-600'}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {missing ? (
        <span className="text-red-500 italic text-sm font-medium">Not Available</span>
      ) : (
        <p className="font-medium text-gray-900">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

const ContactItem = ({ icon: Icon, value, isLink = false }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-50 rounded-full">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 truncate">
      {isLink && value && value !== 'Not available' ? (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-800 truncate">{value}</p>
      )}
    </div>
  </div>
);

const HighlightItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <div className="p-1 bg-green-100 rounded-full">
      <Check className="w-3 h-3 text-green-600" />
    </div>
    <span className="text-sm text-gray-800">{text}</span>
  </div>
);
