import { useState, useEffect } from 'react';
import { socialNetworks } from '../utils/socialNetworks';

function SocialNetworkInput({ value, onChange, label }) {
  const [selectedNetwork, setSelectedNetwork] = useState('LinkedIn');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize component with existing value
    if (value) {
      const network = Object.values(socialNetworks).find(n => 
        value.toLowerCase().includes(n.baseUrl.toLowerCase())
      );
      if (network) {
        setSelectedNetwork(network.name);
        const usernameFromUrl = value.replace(new RegExp(`.*${network.baseUrl}`, 'i'), '').trim();
        setUsername(usernameFromUrl);
      }
    }
  }, [value]);

  const handleNetworkChange = (e) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    setError('');
    updateValue(newNetwork, username);
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setError('');
    updateValue(selectedNetwork, newUsername);
  };

  const handlePaste = (e) => {
    // Don't prevent default paste behavior
    const pastedText = e.clipboardData.getData('text').trim();
    
    try {
      // Try to match the pasted URL with a known network
      const network = Object.values(socialNetworks).find(n => 
        pastedText.toLowerCase().includes(n.baseUrl.toLowerCase())
      );

      if (network) {
        // Extract username from the pasted URL
        const usernameFromUrl = pastedText
          .replace(new RegExp(`.*${network.baseUrl}`, 'i'), '')
          .split(/[?#]/)[0] // Remove query parameters and hash
          .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
          .trim();

        if (usernameFromUrl) {
          setSelectedNetwork(network.name);
          setUsername(usernameFromUrl);
          updateValue(network.name, usernameFromUrl);
          setError('');
          e.preventDefault(); // Only prevent default if we successfully parsed a URL
        }
      }
    } catch (error) {
      console.error('Error handling paste:', error);
      // Don't set error or prevent default - let the normal paste behavior work
    }
  };

  const updateValue = (network, user) => {
    const selectedNetworkConfig = Object.values(socialNetworks).find(n => n.name === network);
    if (selectedNetworkConfig && user) {
      onChange(selectedNetworkConfig.baseUrl + user);
    } else {
      onChange('');
    }
  };

  const currentNetwork = socialNetworks[selectedNetwork.toLowerCase()];

  return (
    <div className="space-y-2">
      <label className="block text-gray-700">
        {label || 'Professional Network'}
      </label>
      <div className="flex gap-2">
        <select
          value={selectedNetwork}
          onChange={handleNetworkChange}
          className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
        >
          {Object.values(socialNetworks).map(network => (
            <option key={network.name} value={network.name}>
              {network.name}
            </option>
          ))}
        </select>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 truncate max-w-[120px]">
            {currentNetwork.prefix}
          </div>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onPaste={handlePaste}
            className="w-full pl-[130px] pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
            placeholder={currentNetwork.placeholder}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-sm text-gray-500">{currentNetwork.helper}</p>
    </div>
  );
}

export default SocialNetworkInput; 