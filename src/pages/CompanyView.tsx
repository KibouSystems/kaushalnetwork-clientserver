import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import {
  Building2,
  Users,
  FileText,
  Globe,
  MapPin,
  Briefcase,
  Building,
  CheckCircle,
} from 'lucide-react';

interface CompanyView {
  // ... copy the interface properties from CompanyData
}

export default function CompanyView() {
  const [company, setCompany] = useState<CompanyView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = Cookies.get('auth_token');

        // --------------================================================================================

        // issueeeeeeeeeeeeeeeeeeee-----------------------
        const response = await axios.get('http://localhost:3000/api/v0/company/company-user-view', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompany(response.data);
        console.log(company?.logoUrl);
      } catch (error) {
        toast.error('Failed to fetch company data');
        console.error('Error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="px-8 py-6 -mt-16">
            <div className="flex items-end space-x-5">
              <div className="relative">
                {company?.logoUrl}

                <img
                  src="http://localhost:3000/uploads/1747147674266_ganesh.jpg"
                  alt={company?.companyName}
                  className="h-24 w-24 rounded-xl border-4 border-white shadow-lg bg-white object-cover"
                />
                {company?.verified && (
                  <div className="absolute -right-2 -bottom-2">
                    <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 mb-2">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {company?.companyName}
                </h2>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Building2 className="h-4 w-4" />
                  <span>{company?.tradeName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <motion.div
              className="bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem icon={Building} label="Legal Name" value={company?.legalName} />
                  <InfoItem icon={Briefcase} label="Company Type" value={company?.companyType} />
                  <InfoItem icon={Globe} label="Website" value={company?.websiteUrl} isLink />
                  <InfoItem
                    icon={Users}
                    label="Team Size"
                    value={`${company?.minEmployeeCount} - ${company?.maxEmployeeCount}`}
                  />
                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={company?.registeredOfficeAddress}
                    className="md:col-span-2"
                  />
                </div>
              </div>
            </motion.div>

            {/* Branches */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Branches</h2>
              <div className="grid gap-4">
                {company.branches.map(branch => (
                  <div key={branch.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{branch.branchAddress}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brands */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Brands</h2>
              <div className="grid grid-cols-3 gap-4">
                {company.brands.map(brand => (
                  <div key={brand.id} className="p-4 bg-gray-50 rounded-lg text-center">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-medium">{brand.brandName}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Documents - Right Column */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              <div className="space-y-3">
                <DocumentLink label="MSME Registration" url={company.msmeRegistrationDocumentUrl} />
                <DocumentLink label="CIN Document" url={company.cinDocumentUrl} />
                <DocumentLink label="PAN Document" url={company.panUrl} />
                <DocumentLink label="GSTIN Document" url={company.gstinDocumentUrl} />
                <DocumentLink label="Aadhar Document" url={company.aadharDocumentUrl} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value, isLink = false, className = '' }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="font-medium text-gray-900 truncate">{value || 'N/A'}</p>
      )}
    </div>
  </div>
);

const DocumentLink = ({ label, url }) => {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <FileText className="w-5 h-5 text-blue-500" />
      <span className="text-gray-700">{label}</span>
    </a>
  );
};
