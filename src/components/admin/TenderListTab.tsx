import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  DollarSign,
  MapPin,
  Clock,
  Plus,
  Search,
  Building,
  CheckCircle,
  FileText,
  Briefcase,
  ArrowRight,
  X,
  Filter,
  Calendar,
  AlertCircle,
  Tag,
  Layers,
  Truck,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface TenderData {
  tenderName: string;
  objective: string;
  description: string;
  productsAndServicesRequired: string;
  aboutProductsAndServices: string;
  nomenclature: string;
  pricingCategory: 'PERUNIT' | 'MONTHLY'; // Update enum type
  totalPrice: string;
  locationOfService: string;
  deliveryTerms: string;
  paymentTerms: string;
  otherConditions: string;
}

interface TenderWithCompany extends TenderData {
  id: number;
  Company: {
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

interface DetailedProposal {
  id: number;
  tenderId: number;
  proposedPrice: string;
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

export default function TenderListTab() {
  const [tenders, setTenders] = useState<TenderWithCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<TenderData>({
    tenderName: '',
    objective: '',
    description: '',
    productsAndServicesRequired: '',
    aboutProductsAndServices: '',
    nomenclature: '',
    pricingCategory: 'PERUNIT',
    totalPrice: '',
    locationOfService: '',
    deliveryTerms: '',
    paymentTerms: '',
    otherConditions: '',
  });
  const [activeSubTab, setActiveSubTab] = useState<'tenders' | 'proposals'>('tenders');
  const [proposals, setProposals] = useState<
    Array<{
      id: number;
      tenderId: number;
      proposedPrice: string;
    }>
  >([]);
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null);
  const [proposalDetails, setProposalDetails] = useState<DetailedProposal[]>([]);

  useEffect(() => {
    fetchTenders();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'proposals') {
      fetchProposals();
    }
  }, [activeSubTab]);

  const fetchTenders = async (companyName?: string) => {
    try {
      const authToken = Cookies.get('auth_token');
      const url = companyName
        ? `http://localhost:3000/api/v0/tender/user-view/all?companyName=${companyName}`
        : 'http://localhost:3000/api/v0/tender/user-view/all';

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTenders(response.data as TenderWithCompany[]);
      console.log('Fetched tenders:', response.data); // Debug log
    } catch (error) {
      toast.error('Failed to fetch tenders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(
        'http://localhost:3000/api/v0/tender-application/proposed/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProposals(response.data);
    } catch (error) {
      toast.error('Failed to fetch proposals');
      console.error('Error fetching proposals:', error);
    }
  };

  const fetchProposalDetails = async (tenderId: number) => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(
        `http://localhost:3000/api/v0/tender-application/all?tenderId=${tenderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProposalDetails(response.data);
      setSelectedTenderId(tenderId);
    } catch (error) {
      toast.error('Failed to fetch proposal details');
      console.error('Error fetching proposal details:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      fetchTenders(value);
    } else {
      fetchTenders();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      toast.error('Authentication token not found');
      return;
    }

    const loadingToast = toast.loading('Creating tender...');

    try {
      // Validate price is a number
      const numericPrice = parseFloat(formData.totalPrice);
      if (isNaN(numericPrice)) {
        toast.error('Total price must be a valid number');
        return;
      }

      const payload = {
        ...formData,
        totalPrice: numericPrice.toString(),
      };

      console.log('Sending tender data:', payload); // Debug log

      const response = await axios.post('http://localhost:3000/api/v0/tender', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Add this to handle cookies properly
      });

      toast.dismiss(loadingToast);

      if (response.data.message) {
        toast.success('Tender created successfully');
        setShowForm(false);
        resetForm();
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Error creating tender:', error.response?.data || error);

      // More specific error messages
      if (error.response?.data?.details) {
        const errorDetails = error.response.data.details;
        errorDetails.forEach((detail: any) => {
          toast.error(`${detail.path}: ${detail.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to create tender');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tenderName: '',
      objective: '',
      description: '',
      productsAndServicesRequired: '',
      aboutProductsAndServices: '',
      nomenclature: '',
      pricingCategory: 'PERUNIT',
      totalPrice: '',
      locationOfService: '',
      deliveryTerms: '',
      paymentTerms: '',
      otherConditions: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with background gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-lg shadow-inner">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tenders Management</h1>
              <p className="text-blue-100 mt-1">Publish and manage procurement opportunities</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2.5 w-full rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Tender
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Sub Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-1.5 border border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSubTab('tenders')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-center transition ${
              activeSubTab === 'tenders'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              <span>Tenders</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('proposals')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-center transition ${
              activeSubTab === 'proposals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Proposals</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content based on active subtab */}
      {activeSubTab === 'tenders' ? (
        <>
          {/* Create Tender Form - Improved Design */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Create New Tender</h2>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)} 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form sections with improved styling */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-blue-500" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tender Name</label>
                          <input
                            type="text"
                            value={formData.tenderName}
                            onChange={e => setFormData({ ...formData, tenderName: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                          <input
                            type="text"
                            value={formData.objective}
                            onChange={e => setFormData({ ...formData, objective: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-500" />
                        Description & Requirements
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Products Required
                          </label>
                          <input
                            type="text"
                            value={formData.productsAndServicesRequired}
                            onChange={e =>
                              setFormData({ ...formData, productsAndServicesRequired: e.target.value })
                            }
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            About Products
                          </label>
                          <input
                            type="text"
                            value={formData.aboutProductsAndServices}
                            onChange={e =>
                              setFormData({ ...formData, aboutProductsAndServices: e.target.value })
                            }
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                        Pricing & Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nomenclature</label>
                          <input
                            type="text"
                            value={formData.nomenclature}
                            onChange={e => setFormData({ ...formData, nomenclature: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pricing Category
                          </label>
                          <select
                            value={formData.pricingCategory}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                pricingCategory: e.target.value as 'PERUNIT' | 'MONTHLY',
                              })
                            }
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="PERUNIT">Per Unit</option>
                            <option value="MONTHLY">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                            <input
                              type="text"
                              value={formData.totalPrice}
                              onChange={e => setFormData({ ...formData, totalPrice: e.target.value })}
                              className="block w-full pl-8 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location of Service</label>
                          <input
                            type="text"
                            value={formData.locationOfService}
                            onChange={e => setFormData({ ...formData, locationOfService: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Terms</label>
                          <input
                            type="text"
                            value={formData.deliveryTerms}
                            onChange={e => setFormData({ ...formData, deliveryTerms: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Tender
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tenders List - Improved Design */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading tenders...</p>
            </div>
          ) : (
            <>
              {tenders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tenders.map(tender => (
                    <motion.div
                      key={tender.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className={`h-2 ${getPricingCategoryColor(tender.pricingCategory)}`}></div>
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                tender.Company.logoUrl?.startsWith('http')
                                  ? tender.Company.logoUrl
                                  : `http://localhost:3000/${tender.Company.logoUrl}`
                              }
                              alt={tender.Company.companyName}
                              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                              onError={e => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400';
                              }}
                            />
                            {tender.Company.verified && (
                              <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full shadow-sm" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{tender.tenderName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">{tender.Company.companyName}</span>
                              {tender.Company.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                                {tender.Company.companyType}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                tender.pricingCategory === 'PERUNIT' 
                                  ? 'bg-purple-50 text-purple-700' 
                                  : 'bg-teal-50 text-teal-700'
                              }`}>
                                {tender.pricingCategory === 'PERUNIT' ? 'Per Unit' : 'Monthly'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-gray-600 text-sm line-clamp-2">{tender.description || "No description provided"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                              <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                            </div>
                            <span className="text-gray-900 font-semibold">₹{tender.totalPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-md">
                              <MapPin className="w-3.5 h-3.5 text-green-700" />
                            </div>
                            <span className="text-gray-600 truncate">{tender.locationOfService || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-100 rounded-md">
                              <Building className="w-3.5 h-3.5 text-yellow-700" />
                            </div>
                            <span className="text-gray-600 truncate">{tender.Company.sector}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 rounded-md">
                              <Briefcase className="w-3.5 h-3.5 text-purple-700" />
                            </div>
                            <span className="text-gray-600 truncate">{tender.Company.industry}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
                            <FileText className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tenders found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm ? 'Try different search terms' : 'Start by creating a new tender to see it here'}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create Tender
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Proposals Tab Content - Enhanced Design
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Tender Proposals</h2>
            </div>
          </div>

          <div className="p-6">
            {proposals.length > 0 ? (
              <div className="space-y-6">
                {proposals.map(proposal => (
                  <div key={proposal.id} className="flex flex-col space-y-4">
                    <motion.div
                      className={`bg-white border ${selectedTenderId === proposal.tenderId ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden`}
                      onClick={() => fetchProposalDetails(proposal.tenderId)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-100 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Tender ID: {proposal.tenderId}</p>
                            <p className="text-xs text-gray-500">Proposal ID: {proposal.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">₹{proposal.proposedPrice}</p>
                            <p className="text-xs text-gray-500">Proposed Price</p>
                          </div>
                          <button 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchProposalDetails(proposal.tenderId);
                            }}
                          >
                            <ChevronRight className={`w-5 h-5 transition-transform ${selectedTenderId === proposal.tenderId ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {selectedTenderId === proposal.tenderId && proposalDetails.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 overflow-hidden"
                        >
                          <div className="bg-gray-50 rounded-lg border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Proposal Details
                              </h4>
                            </div>
                            <div className="p-4">
                              <div className="space-y-4">
                                {proposalDetails.map(detail => (
                                  <motion.div 
                                    key={detail.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-lg p-5 shadow-sm border border-gray-100"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="relative">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                          <img
                                            src={
                                              detail.company.logoUrl?.startsWith('http')
                                                ? detail.company.logoUrl
                                                : `http://localhost:3000/${detail.company.logoUrl}`
                                            }
                                            alt={detail.company.companyName}
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                              (e.target as HTMLImageElement).src =
                                                'https://placehold.co/400';
                                            }}
                                          />
                                        </div>
                                        {detail.company.verified && (
                                          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                          <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                              {detail.company.companyName}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                {detail.company.companyType}
                                              </span>
                                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">
                                                {detail.company.entityType}
                                              </span>
                                              {detail.company.verified && (
                                                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full flex items-center gap-1">
                                                  <CheckCircle className="w-3 h-3" />
                                                  Verified
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-blue-50 px-4 py-3 rounded-lg text-center sm:text-right">
                                            <p className="text-xs text-blue-600 uppercase font-semibold">Proposed Amount</p>
                                            <p className="text-xl font-bold text-blue-700">
                                              ₹{detail.proposedPrice}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                          <div className="bg-gray-50 p-2 rounded-md">
                                            <p className="text-gray-500 text-xs">Business Type</p>
                                            <p className="font-medium text-gray-800">{detail.company.businessType}</p>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded-md">
                                            <p className="text-gray-500 text-xs">Entity Type</p>
                                            <p className="font-medium text-gray-800">{detail.company.entityType}</p>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded-md">
                                            <p className="text-gray-500 text-xs">Sector</p>
                                            <p className="font-medium text-gray-800">{detail.company.sector}</p>
                                          </div>
                                          <div className="bg-gray-50 p-2 rounded-md">
                                            <p className="text-gray-500 text-xs">Industry</p>
                                            <p className="font-medium text-gray-800">{detail.company.industry}</p>
                                          </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                          <button className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                                            View Company Profile
                                          </button>
                                          <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            Contact Company
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  No proposals have been submitted for your tenders yet. Check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get color based on pricing category
function getPricingCategoryColor(category: 'PERUNIT' | 'MONTHLY') {
  switch (category) {
    case 'PERUNIT': return 'bg-purple-500';
    case 'MONTHLY': return 'bg-teal-500';
    default: return 'bg-gray-500';
  }
}
