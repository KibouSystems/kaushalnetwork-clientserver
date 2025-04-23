import React, { useState } from "react";
import { Button } from "../components/ui/button";
import logoImage from "../logo/image.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate(); // Add this line at the top of component
  
  const [page, setPage] = useState(1);
  const [formProgress, setFormProgress] = useState(40);
  const [formData, setFormData] = useState({
    // First page data
    enterpriseType: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Second page data
    details: {
      tradeName: "",
      legalName: "",
      logo: null,
      brandNames: [],
      entityType: "",
      incorporationYear: "",
      registeredOffice: "",
      branchAddress: "",
      websiteLink: "",
      involveInBusiness: [],
      nameOfGoods: "", // Change from array to string
      nameOfServices: "", // Change from array to string
      sector: "",
      industry: "",
      numberOfEmployees: "",
      experience: ""
    },
    contacts: [
      {
        name: "",
        designation: "",
        email: "",
        contactNo: ""
      }
    ],
    statutory: {
      msmeRegNo: "",
      msmeDoc: null,
      cinNumber: "",
      cinDoc: null,
      panNumber: "",
      panDoc: null,
      gstinNo: "",
      gstinDoc: null,
      tradeLicenseNo: "",
      tradeLicenseDoc: null,
      iecNo: "",
      iecDoc: null,
      aadharNo: "",
      aadharDoc: null
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: string, index?: number) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (section) {
        if (section === 'contacts' && typeof index !== 'undefined') {
          const newContacts = [...prev.contacts];
          newContacts[index] = { ...newContacts[index], [name]: value };
          return { ...prev, contacts: newContacts };
        }
        return {
          ...prev,
          [section]: { ...prev[section as keyof typeof prev], [name]: value }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, section?: string) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (section === 'statutory') {
        setFormData(prev => ({
          ...prev,
          statutory: { ...prev.statutory, [name]: files[0] }
        }));
      } else if (section === 'details') {
        setFormData(prev => ({
          ...prev,
          details: { ...prev.details, [name]: files[0] }
        }));
      }
    }
  };

  const addPerson = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: "", designation: "", email: "", contactNo: "" }]
    }));
  };

  const addBrandName = () => {
    const brandName = prompt("Enter brand name");
    if (brandName) {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          brandNames: [...prev.details.brandNames, brandName]
        }
      }));
    }
  };

  const validateForm = (data: any) => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!data.enterprise.business_name) errors.push("Business name is required");
    if (!data.enterprise.email) errors.push("Email is required");
    if (!data.enterprise.password) errors.push("Password is required");
    
    // URL validation
    if (data.company_details.website_link && 
        !data.company_details.website_link.startsWith('http')) {
      data.company_details.website_link = `https://${data.company_details.website_link}`;
    }

    return errors;
  };

  const validateRequiredFiles = () => {
    if (!formData.details.logo) {
      toast.error("Logo is required");
      return false;
    }
    if (!formData.statutory.msmeDoc) {
      toast.error("MSME registration document is required");
      return false;
    }
    if (!formData.statutory.cinDoc) {
      toast.error("CIN document is required");
      return false;
    }
    if (!formData.statutory.panDoc) {
      toast.error("PAN document is required");
      return false;
    }
    if (!formData.statutory.gstinDoc) {
      toast.error("GSTIN document is required");
      return false;
    }
    if (!formData.statutory.aadharDoc) {
      toast.error("Aadhar document is required");
      return false;
    }
    return true;
  };

  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRequiredFiles()) {
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Format employee count
      const [minCount = '1', maxCount = '10'] = (formData.details.numberOfEmployees || '').split('-');
      const minEmployees = parseInt(minCount.trim()) || 1;
      const maxEmployees = parseInt(maxCount.trim()) || 10;

      // Company basic details
      formDataToSend.append('companyType', formData.enterpriseType || 'MSME');
      formDataToSend.append('companyName', formData.businessName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('countryCode', '+91');
      formDataToSend.append('contactNumber', formData.contacts[0]?.contactNo || '');
      formDataToSend.append('tradeName', formData.details.tradeName);
      formDataToSend.append('legalName', formData.details.legalName);
      formDataToSend.append('entityType', formData.details.entityType || 'Company');
      formDataToSend.append('brandNames', formData.details.brandNames.join(','));
      formDataToSend.append('incorporationYear', formData.details.incorporationYear);
      formDataToSend.append('registeredOfficeAddress', formData.details.registeredOffice);
      formDataToSend.append('branchAddress', formData.details.branchAddress || '');
      // Format website URL before sending
      formDataToSend.append('websiteUrl', formatWebsiteUrl(formData.details.websiteLink));
      formDataToSend.append('businessType', formData.details.involveInBusiness[0] || 'GOODS');
      formDataToSend.append('deliverableNames', `${formData.details.nameOfGoods},${formData.details.nameOfServices}`);
      formDataToSend.append('sector', formData.details.sector);
      formDataToSend.append('industry', formData.details.industry);
      formDataToSend.append('minEmployeeCount', minEmployees.toString());
      formDataToSend.append('maxEmployeeCount', maxEmployees.toString());

      // Statutory details
      formDataToSend.append('msmeRegistrationNumber', formData.statutory.msmeRegNo);
      formDataToSend.append('cin', formData.statutory.cinNumber);
      formDataToSend.append('pan', formData.statutory.panNumber);
      formDataToSend.append('gstin', formData.statutory.gstinNo);
      formDataToSend.append('tradeLicenseNumber', formData.statutory.tradeLicenseNo);
      formDataToSend.append('iecNumber', formData.statutory.iecNo);
      formDataToSend.append('aadharNumber', formData.statutory.aadharNo);

      // File uploads
      if (formData.details.logo) formDataToSend.append('logo', formData.details.logo);
      if (formData.statutory.msmeDoc) formDataToSend.append('msmeRegistrationDocument', formData.statutory.msmeDoc);
      if (formData.statutory.cinDoc) formDataToSend.append('cinDocument', formData.statutory.cinDoc);
      if (formData.statutory.panDoc) formDataToSend.append('panDocument', formData.statutory.panDoc);
      if (formData.statutory.gstinDoc) formDataToSend.append('gstinDocument', formData.statutory.gstinDoc);
      if (formData.statutory.tradeLicenseDoc) formDataToSend.append('tradeLicenseDocument', formData.statutory.tradeLicenseDoc);
      if (formData.statutory.iecDoc) formDataToSend.append('iecDocument', formData.statutory.iecDoc);
      if (formData.statutory.aadharDoc) formDataToSend.append('aadhar', formData.statutory.aadharDoc);

      const response = await axios.post(
        'http://localhost:3000/api/v0/company',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      if (response.status === 201) {
        toast.success('Registration successful!');
        navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration error:', error.response?.data);
        toast.error(error.response?.data?.message || 'Registration failed');
      } else {
        toast.error('An unexpected error occurred');
        console.error('Registration error:', error);
      }
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    // Validate first page
    if (page === 1) {
      if (!formData.businessName || !formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (!formData.contacts[0].name || !formData.contacts[0].email) {
        toast.error("Please provide at least one contact person's details");
        return;
      }
    }
    
    setPage(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header with Progress */}
        <div className="bg-white rounded-t-2xl shadow-sm p-6 mb-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Begin your Growth Journey
            </h2>
            <img src={logoImage} alt="Logo" className="h-12" />
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <div className={`h-2 rounded-full ${page === 1 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
              <p className={`mt-2 text-sm ${page === 1 ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Basic Details</p>
            </div>
            <div className="w-4"></div>
            <div className="flex-1">
              <div className={`h-2 rounded-full ${page === 2 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
              <p className={`mt-2 text-sm ${page === 2 ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>Company Information</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-b-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {page === 1 && (
              <div className="space-y-6 transition-all duration-300">
                {/* Input Group */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type of Enterprise</label>
                    <select 
                      name="enterpriseType"
                      value={formData.enterpriseType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option>MSME</option>
                      <option>Service Provider</option>
                      <option>Corporate</option>
                      <option>Bank</option>
                      <option>Others</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name of Business</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Create Your Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Your Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="border-t pt-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h4>
                  {formData.contacts.map((contact, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-lg mb-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium text-gray-700">Person {index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {/* Add remove person logic */}}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={contact.name}
                            onChange={(e) => handleInputChange(e, 'contacts', index)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Designation</label>
                          <input
                            type="text"
                            name="designation"
                            value={contact.designation}
                            onChange={(e) => handleInputChange(e, 'contacts', index)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={contact.email}
                            onChange={(e) => handleInputChange(e, 'contacts', index)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Contact No.</label>
                          <input
                            type="text"
                            name="contactNo"
                            value={contact.contactNo}
                            onChange={(e) => handleInputChange(e, 'contacts', index)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addPerson}
                    className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Person
                  </Button>
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="space-y-8 transition-all duration-300">
                {/* Enterprise Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6">Details of Enterprise</h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Trade Name</label>
                      <input 
                        type="text" 
                        name="tradeName"
                        value={formData.details.tradeName}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Legal Name</label>
                      <input 
                        type="text" 
                        name="legalName"
                        value={formData.details.legalName}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Logo</label>
                      <input 
                        type="file" 
                        name="logo"
                        onChange={(e) => handleFileChange(e, 'details')}
                        accept=".png,.jpg" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Type of Entity</label>
                      <select 
                        name="entityType"
                        value={formData.details.entityType}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option>Company</option>
                        <option>LLP</option>
                        <option>Partnership</option>
                        <option>Proprietor</option>
                        <option>Joint Venture</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Incorporation Year</label>
                      <input 
                        type="text" 
                        name="incorporationYear"
                        value={formData.details.incorporationYear}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Registered Office</label>
                      <input 
                        type="text" 
                        name="registeredOffice"
                        value={formData.details.registeredOffice}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Branch Address</label>
                      <input 
                        type="text" 
                        name="branchAddress"
                        value={formData.details.branchAddress}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Website Link</label>
                      <input 
                        type="text" 
                        name="websiteLink"
                        value={formData.details.websiteLink}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Brand Names</label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          onClick={addBrandName}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center"
                        >
                          Add Brand Name
                        </Button>
                        <ul className="ml-4">
                          {formData.details.brandNames.map((brandName, index) => (
                            <li key={index}>{brandName}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Involve in Business of</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Goods', 'Services', 'Trade', 'Securities', 'Investments', 'E-Commerce'].map(item => (
                          <label key={item} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.details.involveInBusiness.includes(item)}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...formData.details.involveInBusiness, item]
                                  : formData.details.involveInBusiness.filter(x => x !== item);
                                handleInputChange({ target: { name: 'involveInBusiness', value: newValue } }, 'details');
                              }}
                              className="mr-2"
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Name of Goods</label>
                      <input 
                        type="text" 
                        name="nameOfGoods"
                        value={formData.details.nameOfGoods}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Name of Services</label>
                      <input 
                        type="text" 
                        name="nameOfServices"
                        value={formData.details.nameOfServices}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Sector</label>
                      <input 
                        type="text" 
                        name="sector"
                        value={formData.details.sector}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Industry</label>
                      <input 
                        type="text" 
                        name="industry"
                        value={formData.details.industry}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Number of Employees</label>
                      <input 
                        type="text" 
                        name="numberOfEmployees"
                        value={formData.details.numberOfEmployees}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Experience</label>
                      <input 
                        type="text" 
                        name="experience"
                        value={formData.details.experience}
                        onChange={(e) => handleInputChange(e, 'details')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                    </div>
                  </div>
                </div>

                {/* Statutory Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6">Statutory Details</h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">MSME Reg. No.</label>
                      <input 
                        type="text" 
                        name="msmeRegNo"
                        value={formData.statutory.msmeRegNo}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="msmeDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">CIN/LLP-CIN</label>
                      <input 
                        type="text" 
                        name="cinNumber"
                        value={formData.statutory.cinNumber}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="cinDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">PAN</label>
                      <input 
                        type="text" 
                        name="panNumber"
                        value={formData.statutory.panNumber}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="panDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf,.jpg,.png" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">GSTIN No.</label>
                      <input 
                        type="text" 
                        name="gstinNo"
                        value={formData.statutory.gstinNo}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="gstinDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Trade License No.</label>
                      <input 
                        type="text" 
                        name="tradeLicenseNo"
                        value={formData.statutory.tradeLicenseNo}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="tradeLicenseDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">IEC No.</label>
                      <input 
                        type="text" 
                        name="iecNo"
                        value={formData.statutory.iecNo}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="iecDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Aadhar No.</label>
                      <input 
                        type="text" 
                        name="aadharNo"
                        value={formData.statutory.aadharNo}
                        onChange={(e) => handleInputChange(e, 'statutory')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      />
                      <input 
                        type="file" 
                        name="aadharDoc"
                        onChange={(e) => handleFileChange(e, 'statutory')}
                        accept=".pdf" 
                        className="mt-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              {page === 2 && (
                <Button
                  type="button"
                  onClick={() => setPage(1)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  Back
                </Button>
              )}
              {page === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
