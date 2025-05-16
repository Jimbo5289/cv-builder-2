// Server Cleanup Utility
import { execSync } from 'child_process';
import os from 'os';

// Function to find and kill processes on specific ports
function killProcessesOnPorts(ports) {
  console.log(`Checking for processes on ports: ${ports.join(', ')}...`);

  for (const port of ports) {
    try {
      // Different command based on OS
      if (os.platform() === 'win32') {
        // For Windows
        const result = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = result.split('\n').filter(line => line.includes(`LISTENING`));
        
        for (const line of lines) {
          const match = line.match(/(\d+)$/);
          if (match && match[1]) {
            const pid = match[1].trim();
            console.log(`Killing process ${pid} on port ${port}`);
            execSync(`taskkill /F /PID ${pid}`);
          }
        }
      } else {
        // For macOS and Linux
        try {
          const result = execSync(`lsof -i :${port} | grep LISTEN`).toString();
          const lines = result.split('\n').filter(Boolean);
          
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
              const pid = parts[1];
              console.log(`Killing process ${pid} on port ${port}`);
              execSync(`kill -9 ${pid}`);
            }
          }
        } catch (e) {
          // Process probably doesn't exist, which is fine
          console.log(`No process found on port ${port}`);
        }
      }
    } catch (error) {
      // Ignore errors if the command fails or no processes are found
      console.log(`No active process found on port ${port}`);
    }
  }
}

// Ports to check for server processes
const serverPorts = [3005, 3006, 3007, 3008, 3009];
const frontendPorts = [5173, 5174, 5175, 5176, 5177];

console.log("Starting server cleanup process...");

// Kill server processes
killProcessesOnPorts(serverPorts);

// Kill frontend dev server processes
killProcessesOnPorts(frontendPorts);

console.log("Cleanup completed. You can now restart your servers.");
console.log("");
console.log("To start the backend server with mock subscription data:");
console.log("  cd server && MOCK_SUBSCRIPTION_DATA=true npm run dev");
console.log("");
console.log("To start the frontend dev server:");
console.log("  cd .. && npm run dev"); 