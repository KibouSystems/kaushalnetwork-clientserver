import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import KaushalUpdates from '../components/Landing_Page_component/KaushalUpdates';
import ForMSMEs from '../components/Landing_Page_component/ForMSMEs';
// import ForServiceProviders from "../components/Landing_Page_component/";
// import ForCorporates from "../components/Landing_Page_component/ForCorporates";
import WhyJoinKaushalNetwork from '../components/Landing_Page_component/WhyJoinKaushalNetwork';

const LandingPage = () => {
  const [sector, setSector] = useState('');
  const [productOrService, setProductOrService] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    const searchPayload = {
      sector,
      productOrService,
      location,
    };

    try {
      const response = await fetch('dummyurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      console.log('Server response:', data);

      // Navigate if needed based on result
      // navigate("/results", { state: { results: data } });
    } catch (error) {
      console.error('Error sending search term:', error);
      navigate('/register-company');
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
            <Button className="bg-blue-600 text-white px-8 py-6 text-lg rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all">
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
            <h4 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Match</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                placeholder="Sector (e.g., Manufacturing)"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
              <Input
                placeholder="Product / Service"
                value={productOrService}
                onChange={(e) => setProductOrService(e.target.value)}
              />
              <Input
                placeholder="Location (e.g., Delhi)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mt-8 text-center">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-6 rounded-full text-lg hover:shadow-lg transition-all"
                onClick={handleSearch}
              >
                Search Opportunities
              </Button>
            </div>
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
