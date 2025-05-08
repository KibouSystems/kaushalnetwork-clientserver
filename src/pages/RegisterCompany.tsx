import { useState } from 'react';
import logoImage from '../logo/image.png';

export default function RegisterCompany() {
  const [formData, setFormData] = useState({
    typeOfEnterprise: '',
    nameOfBusiness: '',
    email: '',
    password: '',
    confirmPassword: '',
    tradeName: '',
    legalName: '',
    logo: null as File | null,
    brandNames: [] as string[],
    typeOfEntity: '',
    incorporationYear: '',
    registeredOffice: '',
    branchAddress: '',
    websiteLink: '',
    businessInvolvement: '',
    goods: [] as string[],
    services: [] as string[],
    others: [] as string[],
    sector: '',
    industry: '',
    noOfEmployees: '',
    experience: '',
    contact1: { name: '', designation: '', email: '', contactNo: '' },
    contact2: { name: '', designation: '', email: '', contactNo: '' },
    statutory: {
      msmeRegNo: '',
      msmeRegAttachment: null as File | null,
      cin: '',
      cinAttachment: null as File | null,
      pan: '',
      panAttachment: null as File | null,
      gstin: '',
      gstinAttachment: null as File | null,
      tradeLicenseNo: '',
      tradeLicenseAttachment: null as File | null,
      iecNo: '',
      iecAttachment: null as File | null,
      aadharNo: '',
      aadharAttachment: null as File | null,
      otherDetails: '',
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(formData);
    alert('Form submitted!');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-12 border-b pb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Begin your Growth Journey</h2>
              <p className="mt-2 text-gray-600">Join Kaushal Network and expand your business horizons</p>
            </div>
            <img src={logoImage} alt="Kaushal Network" className="h-20 w-20 object-contain" />
          </div>

          {/* Basic Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Enterprise</label>
                <input 
                  name="typeOfEnterprise" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name of Business</label>
                <input 
                  name="nameOfBusiness" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Enterprise Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Name</label>
                <input 
                  name="tradeName" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Name</label>
                <input 
                  name="legalName" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <input
                  name="logo"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Entity</label>
                <select 
                  name="typeOfEntity" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Company">Company</option>
                  <option value="LLP">LLP</option>
                  <option value="Proprietor">Proprietor</option>
                  <option value="Joint Venture">Joint Venture</option>
                  <option value="Foreign Company">Foreign Company</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products and Services Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products and Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Involvement</label>
                <input 
                  name="businessInvolvement" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <input 
                  name="sector" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input 
                  name="industry" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Person 1 Name</label>
                <input 
                  name="contact1.name" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Person 1 Designation</label>
                <input
                  name="contact1.designation"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Person 1 Email</label>
                <input
                  name="contact1.email"
                  type="email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Person 1 Contact No</label>
                <input 
                  name="contact1.contactNo" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Statutory Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Statutory Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MSME Reg. No</label>
                <input 
                  name="statutory.msmeRegNo" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CIN/LLP-CIN</label>
                <input 
                  name="statutory.cin" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PAN</label>
                <input 
                  name="statutory.pan" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN No.</label>
                <input 
                  name="statutory.gstin" 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
