import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TwoFactorSetup from '../components/TwoFactorSetup';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('security');
  const { user } = useAuth();

  const tabs = [
    { id: 'security', name: 'Security' },
    { id: 'profile', name: 'Profile' },
    { id: 'notifications', name: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-[#E78F81] text-[#E78F81]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="mt-8">
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <TwoFactorSetup />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="current-password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="new-password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81]"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Information
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={user?.name}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user?.email}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81]"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="security"
                          name="security"
                          type="checkbox"
                          className="focus:ring-[#E78F81] h-4 w-4 text-[#E78F81] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="security" className="font-medium text-gray-700">Security alerts</label>
                        <p className="text-gray-500">Get notified when there are login attempts from new devices.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="updates"
                          name="updates"
                          type="checkbox"
                          className="focus:ring-[#E78F81] h-4 w-4 text-[#E78F81] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="updates" className="font-medium text-gray-700">Product updates</label>
                        <p className="text-gray-500">Receive updates about new features and improvements.</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81]"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 