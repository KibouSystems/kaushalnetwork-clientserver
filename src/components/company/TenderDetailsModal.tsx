import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Tender } from '../../types/company.types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface TenderDetailsModalProps {
  tender: Tender | null; // Make tender nullable
  isOpen: boolean;
  onClose: () => void;
}

export const TenderDetailsModal = ({ tender, isOpen, onClose }: TenderDetailsModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');

  // Update proposedPrice when tender changes
  useEffect(() => {
    if (tender) {
      setProposedPrice(tender.totalPrice);
    }
  }, [tender]);

  if (!tender) return null;

  const handleExpressInterest = async () => {
    if (!showPriceInput) {
      setShowPriceInput(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = Cookies.get('auth_token');

      if (!token) {
        toast.error('Please login to express interest');
        return;
      }

      await axios.post(
        'http://69.62.79.102:3000/api/v0/tender-application',
        {
          tenderId: tender.id,
          proposedPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Interest expressed successfully');
      setShowPriceInput(false);
      onClose();
    } catch (error: any) {
      console.error('Failed to express interest:', error);
      toast.error(error.response?.data?.message || 'Failed to express interest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen &&
        tender && ( // Add tender check here
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-2xl w-full bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="relative h-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Tender Details</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">
                      {tender.tenderName}
                    </h3>
                    <p className="text-gray-600">{tender.objective}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <DetailItem label="Pricing Model" value={tender.pricingCategory} />
                    <DetailItem label="Total Value" value={`₹${tender.totalPrice}`} />
                    <DetailItem label="Location" value={tender.locationOfService} />
                    <DetailItem label="Delivery Terms" value={tender.deliveryTerms} />
                  </div>

                  {/* Products & Services */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Products/Services</h4>
                    <p className="text-gray-600">{tender.productsAndServicesRequired}</p>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                    <p className="text-gray-600">{tender.aboutProductsAndServices}</p>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Terms</h4>
                      <p className="text-gray-600">{tender.paymentTerms}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Other Conditions</h4>
                      <p className="text-gray-600">{tender.otherConditions}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <div className="flex-1 space-y-4">
                      {showPriceInput && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={proposedPrice}
                            onChange={e => setProposedPrice(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your proposed price"
                          />
                        </div>
                      )}
                      <Button
                        onClick={handleExpressInterest}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? 'Submitting...'
                          : showPriceInput
                            ? 'Submit Interest'
                            : 'Express Interest'}
                      </Button>
                    </div>
                    <Button variant="outline" className="flex-1">
                      Download Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
    </AnimatePresence>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);
