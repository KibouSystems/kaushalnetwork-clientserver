import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, MapPin, Clock, Plus, Search, Building, CheckCircle } from 'lucide-react';
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
  pricingCategory: 'PERUNIT' | 'MONTHLY';  // Update enum type
  totalPrice: string;
  locationOfService: string;
  deliveryTerms: string;
  paymentTerms: string;
  otherConditions: string;
}

interface TenderWithCompany extends TenderData {
  id: number;
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
    otherConditions: ''
  });

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async (companyName?: string) => {
    try {
      const authToken = Cookies.get('auth_token');
      const url = companyName 
        ? `http://localhost:3000/api/v0/tender/user-view/all?companyName=${companyName}`
        : 'http://localhost:3000/api/v0/tender/user-view/all';

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setTenders(response.data);
    } catch (error) {
      toast.error('Failed to fetch tenders');
    } finally {
      setLoading(false);
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
        totalPrice: numericPrice.toString()
      };

      console.log('Sending tender data:', payload);  // Debug log

      const response = await axios.post(
        'http://localhost:3000/api/v0/tender',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true // Add this to handle cookies properly
        }
      );

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
      otherConditions: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenders Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Tender
          </button>
        </div>
      </div>

      {/* Create Tender Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tender Name</label>
                <input
                  type="text"
                  value={formData.tenderName}
                  onChange={(e) => setFormData({ ...formData, tenderName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Objective</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Products Required</label>
                <input
                  type="text"
                  value={formData.productsAndServicesRequired}
                  onChange={(e) => setFormData({ ...formData, productsAndServicesRequired: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">About Products</label>
                <input
                  type="text"
                  value={formData.aboutProductsAndServices}
                  onChange={(e) => setFormData({ ...formData, aboutProductsAndServices: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomenclature</label>
                <input
                  type="text"
                  value={formData.nomenclature}
                  onChange={(e) => setFormData({ ...formData, nomenclature: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Pricing Category</label>
                <select
                  value={formData.pricingCategory}
                  onChange={(e) => setFormData({ ...formData, pricingCategory: e.target.value as 'PERUNIT' | 'MONTHLY' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="PERUNIT">Per Unit</option>
                  <option value="MONTHLY">Monthly</option> {/* Update option */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Price</label>
                <input
                  type="text"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Tender
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tenders List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={`http://localhost:3000/${tender.company.logoUrl}`}
                    alt={tender.company.companyName}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400";
                    }}
                  />
                  {tender.company.verified && (
                    <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{tender.tenderName}</h3>
                  <p className="text-sm text-gray-500">{tender.company.companyName}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {tender.company.companyType}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                      {tender.pricingCategory}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{tender.description}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{tender.totalPrice}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{tender.locationOfService || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{tender.company.sector} • {tender.company.industry}</span>
                </div>
              </div>
            </div>
          ))}

          {tenders.length === 0 && (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders found</h3>
              <p className="mt-1 text-sm text-gray-500">{searchTerm ? 'Try different search terms' : 'Start by creating a new tender'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
