import { useServer } from '../context/ServerContext';

const ServerStatusIndicator = () => {
  const { 
    status, 
    apiUrl, 
    retryConnection, 
    isConnected, 
    isChecking, 
    isReconnecting,
    connectionError,
    lastChecked
  } = useServer();

  // Format last checked time
  const formatLastChecked = () => {
    if (!lastChecked) return 'Never';
    
    const now = new Date();
    const diff = now - lastChecked;
    
    if (diff < 60000) { // Less than a minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than an hour
      const mins = Math.floor(diff / 60000);
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return lastChecked.toLocaleTimeString();
    }
  };

  // Render appropriate indicator based on status
  const renderIndicator = () => {
    if (isConnected) {
      return (
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full mr-1.5 animate-pulse"></div>
          <span className="text-xs font-medium">Server connected</span>
          <span className="text-xs text-gray-500 ml-1.5">({apiUrl?.split('://')[1]})</span>
        </div>
      );
    } else if (isChecking) {
      return (
        <div className="flex items-center text-blue-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5 animate-pulse"></div>
          <span className="text-xs font-medium">Checking connection...</span>
        </div>
      );
    } else if (isReconnecting) {
      return (
        <div className="flex items-center text-yellow-600">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 animate-pulse"></div>
          <span className="text-xs font-medium">Reconnecting...</span>
          <button 
            onClick={retryConnection} 
            className="ml-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded"
          >
            Force retry
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-1.5"></div>
          <span className="text-xs font-medium">Server disconnected</span>
          <button 
            onClick={retryConnection} 
            className="ml-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-1.5 py-0.5 rounded"
          >
            Retry
          </button>
        </div>
      );
    }
  };

  // Show expanded details on hover
  const renderExpandedInfo = () => {
    return (
      <div className="absolute bottom-full right-0 mb-2 bg-white shadow-lg rounded-lg p-3 w-64 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="font-medium text-gray-800 mb-1">Server Status</div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium ${
            isConnected ? 'text-green-600' : 
            isReconnecting ? 'text-yellow-600' :
            isChecking ? 'text-blue-500' : 'text-red-600'
          }`}>
            {status}
          </span>
        </div>
        {apiUrl && (
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">URL:</span>
            <span className="font-medium">{apiUrl}</span>
          </div>
        )}
        <div className="flex justify-between mb-1">
          <span className="text-gray-500">Last checked:</span>
          <span className="font-medium">{formatLastChecked()}</span>
        </div>
        {connectionError && (
          <div className="mt-2 text-red-500 text-xs">
            {connectionError}
          </div>
        )}
        {!isConnected && (
          <div className="mt-2 text-gray-500 text-xs">
            Auto-reconnecting...
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-2 right-2 bg-white shadow-md rounded-lg px-3 py-1.5 z-50 group hover:shadow-lg transition-shadow">
      {renderExpandedInfo()}
      {renderIndicator()}
    </div>
  );
};

export default ServerStatusIndicator; 