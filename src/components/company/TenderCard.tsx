import { motion } from 'framer-motion';
import { Calendar, MapPin, Package, DollarSign, FileText, Building } from 'lucide-react';
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
    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-xl text-gray-900">{tender.tenderName}</h3>
            <p className="text-gray-600 mt-1 text-sm">{tender.objective}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          tender.pricingCategory === 'PERUNIT' 
            ? 'bg-blue-50 text-blue-700'
            : 'bg-purple-50 text-purple-700'
        }`}>
          {tender.pricingCategory}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{tender.company.companyType}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{tender.locationOfService}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-900 font-medium">₹{tender.totalPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Active</span>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <Button 
          onClick={() => onViewDetails(tender)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  </motion.div>
);
