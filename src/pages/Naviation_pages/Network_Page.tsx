import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Company } from '../../types/company';
import { Search, Building2, Users, Briefcase, MapPin, Mail, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NetworkPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    location: '',
    companyType: '',
    productService: '',
  });
  const [loading, setLoading] = useState(true);

  // Use the debounced value
  const searchTerm = useDebounce(filters.search, 300);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v0/company/all');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = 
        !filters.search ||
        company.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        company.sector.toLowerCase().includes(filters.search.toLowerCase()) ||
        company.industry.toLowerCase().includes(filters.search.toLowerCase());

      const matchesSector = !filters.sector || company.sector === filters.sector;
      const matchesLocation = !filters.location || company.registeredOfficeAddress.includes(filters.location);
      const matchesType = !filters.companyType || company.companyType === filters.companyType;
      const matchesProduct = !filters.productService || company.deliverableNames.includes(filters.productService);

      return matchesSearch && matchesSector && matchesLocation && matchesType && matchesProduct;
    });
  }, [companies, filters]);

  const CompanyCard = ({ company }: { company: Company }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-4">
          <img
            src={`http://localhost:3000/${company.logoUrl}`}
            alt={company.companyName}
            className="w-16 h-16 rounded object-cover bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
            }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{company.companyName}</h3>
            <p className="text-sm text-gray-600">{company.sector} | {company.industry}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 text-sm border-b">
        <button className="flex items-center justify-center p-2 hover:bg-gray-50 space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span>Chat</span>
        </button>
        <button className="flex items-center justify-center p-2 hover:bg-gray-50 space-x-1">
          <Mail className="w-4 h-4" />
          <span>Mail</span>
        </button>
        <button className="flex items-center justify-center p-2 hover:bg-gray-50 space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Schedule</span>
        </button>
      </div>

      {/* Company Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Type</p>
            <p>{company.companyType}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p>{company.registeredOfficeAddress}</p>
          </div>
          <div>
            <p className="text-gray-600">Products/Services</p>
            <p>{company.deliverableNames}</p>
          </div>
          <div>
            <p className="text-gray-600">Experience</p>
            <p>{new Date().getFullYear() - company.incorporationYear} years</p>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline">View Profile</Button>
          <Button size="sm" variant="outline">Send Query</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(f => ({ ...f, sector: e.target.value }))}
              >
                <option value="">Select Sector</option>
                <option value="IT">IT</option>
                <option value="Manufacturing">Manufacturing</option>
                {/* Add more sectors */}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
              >
                <option value="">Select Location</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                {/* Add more locations */}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(f => ({ ...f, companyType: e.target.value }))}
              >
                <option value="">Company Type</option>
                <option value="MSME">MSME</option>
                <option value="Bank">Bank</option>
                {/* Add more types */}
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Product/Service"
                className="w-full p-2 border rounded"
                onChange={(e) => setFilters(f => ({ ...f, productService: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}

        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No companies found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;
