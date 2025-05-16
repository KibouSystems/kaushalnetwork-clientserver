import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  MapPin,
  Globe,
  Calendar,
  BadgeCheck,
  Mail,
  Phone,
  Award,
  BriefcaseIcon,
  FileText,
  TrendingUp,
  Users2,
  Boxes,
  Clock,
  BookOpen,
  Package,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { TenderCard } from '../components/company/TenderCard';
import { TenderDetailsModal } from '../components/company/TenderDetailsModal';

interface CompanyDetails {
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
  branches: Array<{
    id: number;
    branchAddress: string;
  }>;
  brands: Array<{
    id: number;
    brandName: string;
  }>;
}

interface MissingFields {
  // 🔴 Financial Information
  gstNumber?: string;
  panNumber?: string;
  annualTurnover?: string;
  registrationNumber?: string;

  // 🔴 Business Information
  majorMarkets?: string[];
  importExportCode?: string;
  businessActivities?: string[];

  // 🔴 Additional Details
  certifications?: string[];
  qualityStandards?: string[];
  machineryEquipment?: string[];
  infrastructureDetails?: string[];

  // 🔴 Key Statistics
  totalEmployees?: number;
  factorySize?: string;
  monthlyCapacity?: string;
  annualProduction?: string;

  // 🔴 Media & Documents
  productImages?: string[];
  factoryImages?: string[];
  catalogues?: string[];
  brochures?: string[];

  // 🔴 Company History
  milestones?: Array<{
    year: number;
    achievement: string;
  }>;
  awards?: string[];

  // 🔴 Location Details
  registrationState?: string;
  operatingLocations?: string[];

  // 🔴 Contact Person Details
  primaryContact?: {
    name: string;
    designation: string;
    phone: string;
    email: string;
  };
}

interface ExtendedCompanyDetails extends CompanyDetails, MissingFields {}

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

// Helper for missing fields in red
const MissingField = ({ text }: { text: string }) => (
  <span className="text-red-500 italic text-sm">🔴 {text} (missing)</span>
);

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<ExtendedCompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyResponse, tendersResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/v0/company/user-view?id=${id}`),
          axios.get(
            `http://localhost:3000/api/v0/tender/user-view/all?companyName=${encodeURIComponent(company?.companyName || '')}`
          ),
        ]);

        setCompany(companyResponse.data);
        setTenders(tendersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, company?.companyName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Company not found</h1>
        <Button onClick={() => navigate('/network')}>Back to Network</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-end">
        {/* Banner Content */}
        <div className="w-full flex items-end justify-start px-8 pb-6 relative z-10">
          <div className="flex items-end gap-6">
            <div className="relative">
              <img
                src={company?.logoUrl}
                alt={company?.companyName}
                className="w-36 h-36 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
                }}
              />
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-28 h-3 bg-black/10 rounded-full blur-sm"></div>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                  {company?.companyName || <MissingField text="Company Name" />}
                </h1>
                {company?.verified && (
                  <BadgeCheck className="text-green-300 w-8 h-8 drop-shadow-lg" />
                )}
              </div>
              <p className="text-lg text-blue-100/90 drop-shadow-md mt-2 font-medium">
                {company?.tradeName || <MissingField text="Trade Name" />}
              </p>
            </div>
          </div>
        </div>
        {/* Decorative background overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              {['Chat', 'Mail', 'Schedule Meet', 'Send Query'].map(action => (
                <Button
                  key={action}
                  variant="outline"
                  className="py-6 hover:bg-blue-50 hover:border-blue-300 transition-all font-semibold text-blue-700"
                >
                  {action}
                </Button>
              ))}
            </div>

            {/* About Section */}
            <motion.div
              className="bg-white rounded-xl p-8 shadow-sm space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900">About Company</h2>
              <p className="text-gray-700">
                {company?.aboutCompany || <MissingField text="Company Description" />}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <InfoItem icon={Building2} label="Legal Name" value={company?.legalName} />
                <InfoItem icon={BriefcaseIcon} label="Company Type" value={company?.companyType} />
                <InfoItem
                  icon={Users}
                  label="Employee Count"
                  value={`${company?.minEmployeeCount || 0} - ${company?.maxEmployeeCount || 0}`}
                />
                <InfoItem
                  icon={Clock}
                  label="Year of Establishment"
                  value={company?.incorporationYear?.toString()}
                />
                <InfoItem icon={Boxes} label="Business Type" value={company?.businessType} />
                <InfoItem icon={TrendingUp} label="Sector" value={company?.sector} />
                {/* Missing fields in red */}
                <InfoItem icon={FileText} label="GST Number" value={company?.gstNumber} missing />
                <InfoItem icon={FileText} label="PAN Number" value={company?.panNumber} missing />
                <InfoItem
                  icon={Award}
                  label="Annual Turnover"
                  value={company?.annualTurnover}
                  missing
                />
              </div>
            </motion.div>

            {/* Products & Services Section - Updated */}
            <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 p-6">
                <h2 className="text-2xl font-bold text-gray-900">Products & Services</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {(company?.deliverableNames?.split(',') || []).map((item, index) => (
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
            </motion.div>

            {/* Brands Section - Updated */}
            <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 p-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Brands</h2>
              </div>
              <div className="p-6">
                {company?.brands && company.brands.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6">
                    {company.brands.map(brand => (
                      <div
                        key={brand.id}
                        className="group flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Building2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                          {brand.brandName}
                        </h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No brands available</div>
                )}
              </div>
            </motion.div>

            {/* Branches Section - Updated */}
            <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 p-6">
                <h2 className="text-2xl font-bold text-gray-900">Business Locations</h2>
              </div>
              <div className="p-6">
                {company?.branches && company.branches.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {company.branches.map(branch => (
                      <div
                        key={branch.id}
                        className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                      >
                        <MapPin className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-gray-900">Branch Office</h3>
                          <p className="text-gray-600 mt-1">{branch.branchAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No branch locations available
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tenders */}
            <motion.div
              className="bg-white rounded-xl p-8 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Active Tenders</h2>
                  <p className="text-gray-500 mt-1">
                    Browse and respond to available opportunities
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {tenders.length} {tenders.length === 1 ? 'tender' : 'tenders'}
                </span>
              </div>

              {tenders.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {tenders.map(tender => (
                    <TenderCard
                      key={tender.id}
                      tender={tender}
                      onViewDetails={tender => setSelectedTender(tender)}
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
            </motion.div>

            {/* Add Modal */}
            <TenderDetailsModal
              tender={selectedTender}
              isOpen={!!selectedTender}
              onClose={() => setSelectedTender(null)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Contact Information</h2>
              <div className="space-y-4">
                <InfoItem icon={MapPin} label="Address" value={company?.registeredOfficeAddress} />
                <InfoItem icon={Mail} label="Email" value={company?.email} />
                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={`${company?.countryCode || ''} ${company?.contactNumber || ''}`}
                />
                <InfoItem icon={Globe} label="Website" value={company?.websiteUrl} isLink />
              </div>
            </motion.div>

            {/* Experience & Expertise */}
            <motion.div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Experience & Expertise <MissingField text="(missing)" />
              </h2>
              <div className="space-y-4 text-red-500">
                <p>Experience details missing</p>
                <p>Expertise areas missing</p>
              </div>
            </motion.div>

            {/* Branches */}
            <motion.div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Branches</h2>
              {company?.branches && company.branches.length > 0 ? (
                <div className="space-y-2">
                  {company.branches.map(branch => (
                    <div key={branch.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{branch.branchAddress}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No branches available</p>
              )}
            </motion.div>

            {/* Clientele */}
            <motion.div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Major Clients <MissingField text="(missing)" />
              </h2>
              <div className="text-red-500">
                <p>Client list missing</p>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Documents</h2>
              <div className="space-y-4">
                {company?.msmeRegistrationDocumentUrl && (
                  <div>
                    <p className="text-sm text-gray-500">MSME Registration:</p>
                    <a
                      href={company.msmeRegistrationDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
                {company?.cinDocumentUrl && (
                  <div>
                    <p className="text-sm text-gray-500">CIN Document:</p>
                    <a
                      href={company.cinDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
                {company?.panUrl && (
                  <div>
                    <p className="text-sm text-gray-500">PAN Document:</p>
                    <a
                      href={company.panUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
                {company?.gstinDocumentUrl && (
                  <div>
                    <p className="text-sm text-gray-500">GSTIN Document:</p>
                    <a
                      href={company.gstinDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
                {company?.aadharDocumentUrl && (
                  <div>
                    <p className="text-sm text-gray-500">Aadhar Document:</p>
                    <a
                      href={company.aadharDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent info display with missing field support
const InfoItem = ({ icon: Icon, label, value, isLink = false, missing = false }) => (
  <div className="flex items-start gap-3">
    <Icon className={`w-5 h-5 ${missing ? 'text-red-400' : 'text-gray-400'} mt-0.5`} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {missing ? (
        <span className="text-red-500 italic text-sm">🔴 {label} (missing)</span>
      ) : isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="font-medium text-gray-900">
          {value || <span className="text-red-500">Not Available</span>}
        </p>
      )}
    </div>
  </div>
);
