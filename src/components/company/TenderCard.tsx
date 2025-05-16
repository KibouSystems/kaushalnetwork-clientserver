import { motion } from 'framer-motion';
import { MapPin, Package, DollarSign, FileText, Building, Tag, CheckCircle } from 'lucide-react';
import { Tender } from '../../types/company.types';
import { Button } from '../ui/button';

interface TenderCardProps {
  tender: Tender;
  onViewDetails: (tender: Tender) => void;
}

export const TenderCard = ({ tender, onViewDetails }: TenderCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
  >
    {/* Color strip based on pricing category */}
    <div className={`h-1.5 ${getCategoryColor(tender.pricingCategory)}`}></div>

    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${getCategoryBgColor(tender.pricingCategory)}`}>
            <Package className={`w-5 h-5 ${getCategoryTextColor(tender.pricingCategory)}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{tender.tenderName}</h3>
            <p className="text-gray-500 text-sm mt-1 flex items-center">
              {tender.company.verified && (
                <span className="inline-flex items-center mr-2 text-green-600 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </span>
              )}
              <span>{tender.company.companyName}</span>
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            tender.pricingCategory === 'PERUNIT'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-teal-100 text-teal-700'
          }`}
        >
          {tender.pricingCategory === 'PERUNIT' ? 'Per Unit' : 'Monthly'}
        </span>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-600 text-sm line-clamp-2">
          {tender.objective || 'No objective provided'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <DollarSign className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-gray-900">₹{tender.totalPrice}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-green-100 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-green-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm text-gray-900 truncate max-w-[120px]">
              {tender.locationOfService || 'Not specified'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-100 rounded-md">
            <Building className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm text-gray-900 truncate max-w-[120px]">
              {tender.company.companyType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-100 rounded-md">
            <Tag className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="text-sm text-gray-900">Active</p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <Button
          onClick={() => onViewDetails(tender)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 shadow-sm font-medium flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View Details & Apply
        </Button>
      </div>
    </div>
  </motion.div>
);

// Helper functions for dynamic styling
function getCategoryColor(category: string): string {
  return category === 'PERUNIT' ? 'bg-indigo-500' : 'bg-teal-500';
}

function getCategoryBgColor(category: string): string {
  return category === 'PERUNIT' ? 'bg-indigo-100' : 'bg-teal-100';
}

function getCategoryTextColor(category: string): string {
  return category === 'PERUNIT' ? 'text-indigo-700' : 'text-teal-700';
}
