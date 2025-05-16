import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { X, CheckCircle, ExternalLink, MapPin, Building, Award, XCircle } from 'lucide-react';

interface CompanyDetailedData {
  id: number;
  verified: boolean;
  tradeName: string;
  legalName: string;
  companyName: string;
  companyType: string;
  email: string;
  logoUrl: string;
  bannerUrl: string | null;
  tagline: string | null;
  registeredOfficeAddress: string;
  websiteUrl: string;
  businessType: string;
  sector: string;
  industry: string;
  minEmployeeCount: number;
  maxEmployeeCount: number;
  msmeRegistrationNumber: string;
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
  deliverableNames: string;
  entityType: string;
  msmeRegistrationDocumentUrl: string;
  incorporationYear: number;
  deleted: boolean;
  annualTurnover: string | null;
  businessActivites: string | null;
  certifications: string | null;
  importExportCode: string | null;
  majorMarkets: string | null;
  operationLocations: string | null;
  qualityStandards: string | null;
  branches: Array<{
    id: number;
    branchAddress: string;
  }>;
  brands: Array<{
    id: number;
    brandName: string;
  }>;
}

interface SuperAdminCompanyModalProps {
  companyId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SuperAdminCompanyModal: React.FC<SuperAdminCompanyModalProps> = ({
  companyId,
  isOpen,
  onClose,
}) => {
  const [companyData, setCompanyData] = useState<CompanyDetailedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unverifying, setUnverifying] = useState(false);

  useEffect(() => {
    if (companyId && isOpen) {
      fetchCompanyDetails(companyId);
    }
  }, [companyId, isOpen]);

  const fetchCompanyDetails = async (id: number) => {
    setLoading(true);
    try {
      const adminToken = Cookies.get('admin_token');
      const response = await axios.get(
        `http://69.62.79.102:3000/api/v0/company/superadmin-view?companyId=${id}`,
        {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : '',
          },
        }
      );
      setCompanyData(response.data);
    } catch (error) {
      toast.error('Failed to fetch company details');
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!companyData || companyData.verified) return;

    setVerifying(true);
    try {
      const adminToken = Cookies.get('admin_token');
      await axios.put(
        `http://69.62.79.102:3000/api/v0/company/verify?companyId=${companyData.id}`,
        {},
        {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : '',
          },
        }
      );
      toast.success(`${companyData.companyName} has been verified successfully`);
      setCompanyData(prev => (prev ? { ...prev, verified: true } : null));
    } catch (error) {
      toast.error('Failed to verify company');
      console.error('Verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleUnverify = async () => {
    if (!companyData || !companyData.verified) return;

    setUnverifying(true);
    try {
      const adminToken = Cookies.get('admin_token');
      await axios.put(
        `http://69.62.79.102:3000/api/v0/company/unverify?companyId=${companyData.id}`,
        {},
        {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : '',
          },
        }
      );
      toast.success(`${companyData.companyName} has been unverified`);
      setCompanyData(prev => (prev ? { ...prev, verified: false } : null));
    } catch (error) {
      toast.error('Failed to unverify company');
      console.error('Unverification error:', error);
    } finally {
      setUnverifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal container */}
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          {/* Header - Made sticky */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur border-b border-gray-200 rounded-t-2xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Company Details
              <span className="ml-2 text-sm font-normal text-gray-500">#{companyData?.id}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-600">Loading company details...</p>
              </div>
            ) : companyData ? (
              <div className="space-y-8">
                {/* Basic Info - Made responsive */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/3">
                    <div className="aspect-square w-full max-w-[240px] mx-auto lg:mx-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={companyData.logoUrl}
                        alt={companyData.companyName}
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740';
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-2/3 space-y-4">
                    {/* Company Status Badge - Made more prominent */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {companyData.companyName}
                      </h3>
                      {companyData.verified ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-2" /> Verified Company
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending Verification
                        </span>
                      )}
                    </div>

                    {/* Grid layout for company details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs text-gray-500">Trade Name</label>
                        <p className="text-sm font-medium">{companyData.tradeName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Legal Name</label>
                        <p className="text-sm font-medium">{companyData.legalName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm font-medium">{companyData.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Type</label>
                        <p className="text-sm font-medium">{companyData.companyType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Entity Type</label>
                        <p className="text-sm font-medium">{companyData.entityType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Business Type</label>
                        <p className="text-sm font-medium">{companyData.businessType}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Website</label>
                        <a
                          href={companyData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          {companyData.websiteUrl} <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Year Founded</label>
                        <p className="text-sm font-medium">{companyData.incorporationYear}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & Business Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Registered Office Address</h4>
                      <p className="text-sm text-gray-600">{companyData.registeredOfficeAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Business Details</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Sector</p>
                          <p className="text-sm">{companyData.sector}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Industry</p>
                          <p className="text-sm">{companyData.industry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Employees</p>
                          <p className="text-sm">
                            {companyData.minEmployeeCount} - {companyData.maxEmployeeCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deliverables</p>
                          <p className="text-sm">{companyData.deliverableNames}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Documents */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Registration Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">MSME Registration</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Number: {companyData.msmeRegistrationNumber}
                        </p>
                        <a
                          href={companyData.msmeRegistrationDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">CIN</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Number: {companyData.cin}</p>
                        <a
                          href={companyData.cinDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">PAN</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Number: {companyData.pan}</p>
                        <a
                          href={companyData.panUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">GSTIN</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Number: {companyData.gstin}</p>
                        <a
                          href={companyData.gstinDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">Aadhar</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Number: {companyData.aadharNumber}</p>
                        <a
                          href={companyData.aadharDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    {companyData.tradeLicenseNumber && companyData.tradeLicenseDocumentUrl && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-medium mb-1">Trade License</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            Number: {companyData.tradeLicenseNumber}
                          </p>
                          <a
                            href={companyData.tradeLicenseDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    )}

                    {companyData.iecNumber && companyData.iecDocumentUrl && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-medium mb-1">IEC</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">Number: {companyData.iecNumber}</p>
                          <a
                            href={companyData.iecDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Branches & Brands */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Branches</h4>
                    {companyData.branches.length > 0 ? (
                      <ul className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        {companyData.branches.map(branch => (
                          <li key={branch.id} className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{branch.branchAddress}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No branches listed</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Brands</h4>
                    {companyData.brands.length > 0 ? (
                      <ul className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        {companyData.brands.map(brand => (
                          <li key={brand.id} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{brand.brandName}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No brands listed</p>
                    )}
                  </div>
                </div>

                {/* About Section (if available) */}
                {(companyData.aboutCompany ||
                  companyData.aboutFounderAndTeam ||
                  companyData.expertise) && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">About</h4>

                    {companyData.aboutCompany && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2 text-gray-800">About Company</h5>
                        <p className="text-sm text-gray-600">{companyData.aboutCompany}</p>
                      </div>
                    )}

                    {companyData.aboutFounderAndTeam && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2 text-gray-800">About Founder & Team</h5>
                        <p className="text-sm text-gray-600">{companyData.aboutFounderAndTeam}</p>
                      </div>
                    )}

                    {companyData.expertise && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2 text-gray-800">Expertise</h5>
                        <p className="text-sm text-gray-600">{companyData.expertise}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">No company data available</p>
              </div>
            )}
          </div>

          {/* Footer - Made sticky */}
          <div className="sticky bottom-0 z-10 px-6 py-4 bg-white/95 backdrop-blur border-t border-gray-200 rounded-b-2xl">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {companyData &&
                (companyData.verified ? (
                  <button
                    onClick={handleUnverify}
                    disabled={unverifying}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {unverifying ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Unverifying...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Unverify Company
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Company
                      </>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
