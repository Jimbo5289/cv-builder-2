import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCheckCircle } from 'react-icons/fi';

export default function SubscriptionModal({ isOpen, onClose, bundleUsed = false }) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const handlePurchase = () => {
    // Navigate to pricing page with the selected option pre-selected
    if (selectedOption === 'premium-bundle') {
      navigate('/pricing', { state: { preselect: 'premium-bundle' } });
    } else if (selectedOption === 'subscription') {
      navigate('/pricing', { state: { preselect: 'subscription' } });
    } else {
      navigate('/pricing');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81]"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {bundleUsed 
                  ? 'Premium Bundle Already Used' 
                  : 'Export Your Professional CV'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {bundleUsed 
                    ? 'Your one-time Premium CV Bundle has already been used. To continue using premium features, choose one of the options below:' 
                    : 'To download or print your professional CV with all features, choose one of the options below:'}
                </p>
              </div>
              
              <div className="mt-4 space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedOption === 'premium-bundle' 
                      ? 'border-[#E78F81] bg-[#E78F81]/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption('premium-bundle')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Premium CV Bundle</h4>
                      <p className="text-sm text-gray-500">One-time purchase for a single CV</p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>All analysis & feedback tools</span>
                        </li>
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>Skills gap identification</span>
                        </li>
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>Premium templates</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">£19.99</span>
                      <p className="text-xs text-gray-500">one-time</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedOption === 'subscription' 
                      ? 'border-[#E78F81] bg-[#E78F81]/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption('subscription')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Monthly Subscription</h4>
                      <p className="text-sm text-gray-500">Unlimited CVs and downloads</p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>Unlimited CV generations</span>
                        </li>
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>All premium features</span>
                        </li>
                        <li className="flex items-start text-xs text-gray-600">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                          <span>Cancel anytime</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">£9.99</span>
                      <p className="text-xs text-gray-500">/month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={!selectedOption}
              onClick={handlePurchase}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#E78F81] text-base font-medium text-white hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] sm:ml-3 sm:w-auto sm:text-sm
                ${!selectedOption ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 