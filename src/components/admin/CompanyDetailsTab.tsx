import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Globe, 
  Briefcase, 
  Users, 
  FileText, 
  Phone, 
  Mail,
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const DocumentCard = ({ 
  title, 
  number, 
  documentUrl 
}: { 
  title: string; 
  number: string; 
  documentUrl: string | null 
}) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <div className="bg-gray-50 py-2 px-3 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
    </div>
    <div className="p-3">
      <p className="text-sm mb-2 font-mono bg-gray-50 p-1 rounded">{number || 'Not provided'}</p>
      {documentUrl ? (
        <a 
          href={`http://localhost:3000/${documentUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <FileText size={14} className="mr-1" />
          View Document
          <ExternalLink size={12} className="ml-1" />
        </a>
      ) : (
        <p className="text-xs text-gray-500 italic">No document uploaded</p>
      )}
    </div>
  </div>
);

const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="bg-blue-100 p-1.5 rounded-md">
      <Icon size={18} className="text-blue-700" />
    </div>
    <h2 className="text-lg font-medium text-gray-800">{title}</h2>
  </div>
);

const InfoSection = ({ title, children, icon, defaultOpen = true }: { 
  title: string; 
  children: React.ReactNode;
  icon: any;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gradient-to-r from-gray-50 to-white"
      >
        <div className="flex items-center">
          <div className="bg-blue-100 p-1.5 rounded-md mr-3">
            <icon size={18} className="text-blue-700" />
          </div>
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        </div>
        {isOpen ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompanyDetailsTab = ({ company }: { company: CompanyData }) => {
  return (
    <div className="p-6">
      {/* Header with Company Overview */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Company Logo */}
          <div className="md:w-1/3 p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-32 h-32 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden p-2">
              <img 
                src={`http://localhost:3000/${company.logoUrl}`}
                alt={`${company.companyName} logo`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Logo";
                }}
              />
            </div>
          </div>
          
          {/* Company Information */}
          <div className="md:w-2/3 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
              <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                company.verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              } flex items-center`}>
                {company.verified 
                  ? <><CheckCircle size={16} className="mr-1" /> Verified</>
                  : <><AlertCircle size={16} className="mr-1" /> Pending Verification</>
                }
              </div>
            </div>
            
            {company.tagline && (
              <p className="text-gray-600 mb-4 italic">{company.tagline}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <Building className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <span className="text-gray-500">Legal Name:</span>
                  <div className="text-gray-900">{company.legalName}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <span className="text-gray-500">Company Type:</span>
                  <div className="text-gray-900">{company.companyType}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <span className="text-gray-500">Employee Count:</span>
                  <div className="text-gray-900">{company.minEmployeeCount} - {company.maxEmployeeCount}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <span className="text-gray-500">Industry:</span>
                  <div className="text-gray-900">{company.sector} - {company.industry}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              {company.websiteUrl && (
                <a 
                  href={company.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Globe size={16} className="mr-1" />
                  Website
                </a>
              )}
              {company.email && (
                <a 
                  href={`mailto:${company.email}`}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Mail size={16} className="mr-1" />
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact & Address */}
      <InfoSection title="Address & Contact Information" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Registered Office Address:</h3>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-200">
              {company.registeredOfficeAddress}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information:</h3>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
              <div className="flex items-center">
                <Mail size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-800">{company.email}</span>
              </div>
              <div className="flex items-center">
                <Globe size={16} className="text-gray-500 mr-2" />
                <a 
                  href={company.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.websiteUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {company.branches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Branch Offices:</h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
              {company.branches.map((branch, index) => (
                <li key={branch.id} className="p-3 bg-gray-50 even:bg-white">
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{branch.branchAddress}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </InfoSection>
      
      {/* Business Details */}
      <InfoSection title="Business Details" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Entity Type:</h3>
              <p className="text-gray-800">{company.entityType}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Business Type:</h3>
              <p className="text-gray-800">{company.businessType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Year of Incorporation:</h3>
              <p className="text-gray-800">{company.incorporationYear}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Products & Services:</h3>
              <p className="text-gray-800 bg-blue-50 p-2 rounded-md">{company.deliverableNames}</p>
            </div>
            
            {company.brands.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Brands:</h3>
                <div className="flex flex-wrap gap-2">
                  {company.brands.map(brand => (
                    <span key={brand.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                      {brand.brandName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          {company.aboutCompany && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">About Company:</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{company.aboutCompany}</p>
              </div>
            </div>
          )}
          
          {company.aboutFounderAndTeam && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">About Founder & Team:</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{company.aboutFounderAndTeam}</p>
              </div>
            </div>
          )}
          
          {company.expertise && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Expertise:</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">{company.expertise}</p>
              </div>
            </div>
          )}
        </div>
      </InfoSection>
      
      {/* Documents & Registration */}
      <InfoSection title="Documents & Registration" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentCard 
            title="MSME Registration"
            number={company.msmeRegistrationNumber}
            documentUrl={company.msmeRegistrationDocumentUrl}
          />
          
          <DocumentCard 
            title="Company Identification Number (CIN)"
            number={company.cin}
            documentUrl={company.cinDocumentUrl}
          />
          
          <DocumentCard 
            title="PAN"
            number={company.pan}
            documentUrl={company.panUrl}
          />
          
          <DocumentCard 
            title="GSTIN"
            number={company.gstin}
            documentUrl={company.gstinDocumentUrl}
          />
          
          {company.tradeLicenseNumber && (
            <DocumentCard 
              title="Trade License"
              number={company.tradeLicenseNumber}
              documentUrl={company.tradeLicenseDocumentUrl}
            />
          )}
          
          {company.iecNumber && (
            <DocumentCard 
              title="IEC"
              number={company.iecNumber}
              documentUrl={company.iecDocumentUrl}
            />
          )}
          
          <DocumentCard 
            title="Aadhar"
            number={company.aadharNumber}
            documentUrl={company.aadharDocumentUrl}
          />
        </div>
      </InfoSection>
    </div>
  );
};

export default CompanyDetailsTab;
