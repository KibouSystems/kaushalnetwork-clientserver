import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { MagnifyingGlass } from '@phosphor-icons/react';
import KaushalUpdates from '../components/Landing_Page_component/KaushalUpdates';
import ForMSMEs from '../components/Landing_Page_component/ForMSMEs';
import WhyJoinKaushalNetwork from '../components/Landing_Page_component/WhyJoinKaushalNetwork';
import { useDebounce } from '../hooks/useDebounce';

const LandingPage = () => {
  const [queryParams, setQueryParams] = useState({
    keyword: '',
    sector: '',
    location: '',
    companyType: '',
    deliverableNames: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedParams = useDebounce(queryParams, 1000);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchResults = async () => {
      if (!Object.values(debouncedParams).some(value => value)) return;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(debouncedParams).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });

        const response = await axios.get(
          `http://69.62.79.102:3000/api/v0/company/all?${params.toString()}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Error fetching results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedParams]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/network');
    } else {
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Hero Section */}
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-70"></div>

        <div className="relative px-8 py-20">
          <motion.section
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connecting Growth Across MSMEs, Corporates & Service Providers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A one-stop networking platform to find clients, partners, and opportunities.
            </p>
            <Button
              className="bg-blue-600 text-white px-8 py-6 text-lg rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </motion.section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
            {[
              { title: '40,000+ MSMEs', desc: 'Explore business connections' },
              { title: '20,000+ Service Providers', desc: 'Scale operations' },
              { title: '1,000+ Corporates', desc: 'Partner for growth' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="overflow-hidden backdrop-blur-lg bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-3">{stat.title}</h3>
                    <p className="text-gray-600">{stat.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* Search Section */}
          <section className="max-w-5xl mx-auto bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
            <h4 className="text-3xl font-bold mb-8 text-center">Find Business Partners</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  onChange={e => setQueryParams(prev => ({ ...prev, keyword: e.target.value }))}
                />
              </div>

              <div>
                <select
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  onChange={e => setQueryParams(prev => ({ ...prev, sector: e.target.value }))}
                >
                  <option value="">Select Sector</option>
                  <option value="IT">IT</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <select
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  onChange={e => setQueryParams(prev => ({ ...prev, companyType: e.target.value }))}
                >
                  <option value="">Company Type</option>
                  <option value="MSME">MSME</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Bank">Bank</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <motion.div
                  className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            ) : (
              searchResults.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h5 className="font-semibold text-gray-700">Quick Results:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.slice(0, 3).map((company: any) => (
                      <div
                        key={company.id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                        onClick={() => navigate(`/company/${company.id}`)}
                      >
                        <h6 className="font-semibold text-blue-600">{company.companyName}</h6>
                        <p className="text-sm text-gray-600">{company.sector}</p>
                      </div>
                    ))}
                    {searchResults.length > 3 && (
                      <Button
                        variant="outline"
                        className="col-span-full"
                        onClick={() =>
                          navigate('/network', { state: { searchParams: queryParams } })
                        }
                      >
                        View All Results ({searchResults.length})
                      </Button>
                    )}
                  </div>
                </div>
              )
            )}
          </section>

          <KaushalUpdates />

          {/* Testimonials Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-8">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Rahul Sharma',
                    role: 'MSME Owner',
                    text: 'Kaushal Network helped us expand our business reach significantly.',
                  },
                  {
                    name: 'Priya Patel',
                    role: 'Service Provider',
                    text: 'Found numerous clients and partnerships through this platform.',
                  },
                  {
                    name: 'Amit Kumar',
                    role: 'Corporate Partner',
                    text: 'The perfect platform to discover and connect with MSMEs.',
                  },
                ].map((testimonial, index) => (
                  <Card key={index} className="bg-white p-6">
                    <CardContent>
                      <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <ForMSMEs />
          </section>

          <WhyJoinKaushalNetwork />
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Kaushal Network</h3>
            <p className="text-gray-400">Connecting businesses for mutual growth</p>
          </div>
          {/* Add more footer sections as needed */}
        </div>
        <div className="text-center text-gray-400 mt-8 pt-8 border-t border-gray-800">
          &copy; {new Date().getFullYear()} Kaushal Network. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
