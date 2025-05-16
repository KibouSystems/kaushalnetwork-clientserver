import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { AlertCircle } from 'lucide-react';

interface CompanyDetails {
  id: number;
  verified: boolean;
  companyName: string;
  // ...other fields
}

interface TenderFormData {
  tenderName: string;
  objective: string;
  description: string;
  productsAndServicesRequired: string;
  aboutProductsAndServices: string;
  nomenclature: string;
  pricingCategory: 'PERUNIT' | 'FIXED';
  totalPrice: string;
  locationOfService: string;
  deliveryTerms: string;
  paymentTerms: string;
  otherConditions: string;
}

export default function TenderForm() {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TenderFormData>({
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

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get('http://69.62.79.102:3000/api/v0/company/admin-view', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyDetails(response.data);
    } catch (error) {
      console.log(error);

      toast.error('Failed to fetch company details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyDetails?.verified) {
      toast.error('Your company account is not verified yet. Please wait for verification.');
      return;
    }

    try {
      const token = Cookies.get('auth_token');
      await axios.post('http://69.62.79.102:3000/api/v0/tender', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Tender created successfully');
      // Reset form
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
    } catch (error) {
      console.error(error);
      toast.error('Failed to create tender');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!companyDetails?.verified) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-yellow-700">Account Verification Pending</h2>
        </div>
        <p className="text-yellow-600 mb-4">
          Your company account is currently under verification. You will be able to post tenders
          once your account is verified.
        </p>
        <div className="bg-white p-4 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Company Details:</h3>
          <p className="text-gray-600">Name: {companyDetails.companyName}</p>
          <p className="text-gray-600">
            Status: {companyDetails.verified ? 'Verified' : 'Pending Verification'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Tender</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tender Name</label>
              <input
                type="text"
                value={formData.tenderName}
                onChange={e => setFormData({ ...formData, tenderName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {/* ...more form fields... */}
          </div>

          {/* Pricing and Terms */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pricing Category</label>
              <select
                value={formData.pricingCategory}
                onChange={e =>
                  setFormData({
                    ...formData,
                    pricingCategory: e.target.value as 'PERUNIT' | 'FIXED',
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="PERUNIT">Per Unit</option>
                <option value="FIXED">Fixed Price</option>
              </select>
            </div>
            {/* ...more form fields... */}
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Tender
          </button>
        </div>
      </form>
    </div>
  );
}
