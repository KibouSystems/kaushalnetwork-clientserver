import { motion } from 'framer-motion';
import { Building, Globe, Users, FileText } from 'lucide-react';
import { CompanyData } from '../../types/company.types';

interface Props {
  company: CompanyData;
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

export default function CompanyDetailsTab({ company }: Props) {
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder-logo.png';
    return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {/* Company Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <img
              src={getImageUrl(company.logoUrl)}
              alt={company.companyName}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-100 shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740";
              }}
            />
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-blue-900 mb-2">{company.companyName}</h1>
              <p className="text-lg text-blue-600 mb-1">{company.tradeName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{company.companyType}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">{company.entityType}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">{company.sector}</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{company.industry}</span>
              </div>
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Registration Details */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-800">Registration</h3>
              <InfoItem label="MSME Number" value={company.msmeRegistrationNumber} />
              <DocumentLink label="MSME Doc" url={company.msmeRegistrationDocumentUrl} />
              <InfoItem label="CIN" value={company.cin} />
              <DocumentLink label="CIN Doc" url={company.cinDocumentUrl} />
              <InfoItem label="PAN" value={company.pan} />
              <DocumentLink label="PAN Doc" url={company.panUrl} />
              <InfoItem label="GSTIN" value={company.gstin} />
              <DocumentLink label="GSTIN Doc" url={company.gstinDocumentUrl} />
            </div>

            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-800">Company Info</h3>
              <InfoItem label="Legal Name" value={company.legalName} />
              <InfoItem label="Email" value={company.email} />
              <InfoItem label="Website" value={company.websiteUrl} isLink />
              <InfoItem label="Employees" value={`${company.minEmployeeCount} - ${company.maxEmployeeCount}`} />
              <InfoItem label="Incorporation Year" value={company.incorporationYear?.toString()} />
              <InfoItem label="Business Type" value={company.businessType} />
              <InfoItem label="Address" value={company.registeredOfficeAddress} />
            </div>

            {/* Products & Brands */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-800">Products & Brands</h3>
              <div className="mb-2">
                <span className="block text-gray-600 font-medium mb-1">Products/Services:</span>
                <div className="flex flex-wrap gap-2">
                  {company.deliverableNames.split(',').map((item, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-gray-600 font-medium mb-1">Brands:</span>
                <div className="flex flex-wrap gap-2">
                  {company.brands && company.brands.length > 0 ? (
                    company.brands.map((brand) => (
                      <span key={brand.id} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                        {brand.brandName}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No brands</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About/Description */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-800">About Company</h3>
            <p className="text-gray-700">
              {company.aboutCompany || <span className="italic text-gray-400">No description available.</span>}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
