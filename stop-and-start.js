const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get all running Vite or Node processes
const findAndKillProcesses = () => {
  return new Promise((resolve) => {
    console.log('Checking for running Vite and Node servers...');
    
    // Different commands for different OS
    const command = process.platform === 'win32'
      ? 'tasklist /fi "imagename eq node.exe" /fo csv /nh'
      : 'ps aux | grep -E "(vite|node)"';
      
    exec(command, (error, stdout) => {
      if (error) {
        console.error(`Error finding processes: ${error.message}`);
        resolve();
        return;
      }
      
      // Get process IDs
      let pids = [];
      if (process.platform === 'win32') {
        // Parse CSV output from Windows
        const lines = stdout.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.includes('node.exe')) {
            const parts = line.split(',');
            if (parts.length >= 2) {
              const pid = parts[1].replace(/"/g, '').trim();
              pids.push(pid);
            }
          }
        });
      } else {
        // Parse Unix-like output
        const lines = stdout.split('\n');
        lines.forEach(line => {
          // Check if this is a Vite or Node server but exclude grep itself and this script
          if ((line.includes('vite') || (line.includes('node') && line.includes('server'))) 
              && !line.includes('grep') 
              && !line.includes('stop-and-start.js')) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
              pids.push(parts[1]);
            }
          }
        });
      }
      
      if (pids.length === 0) {
        console.log('No Vite or Node processes found running');
        resolve();
        return;
      }
      
      // Kill each process
      console.log(`Found ${pids.length} processes. Stopping...`);
      
      let killedCount = 0;
      pids.forEach(pid => {
        const killCommand = process.platform === 'win32'
          ? `taskkill /PID ${pid} /F`
          : `kill -9 ${pid}`;
          
        exec(killCommand, (killError) => {
          if (killError) {
            console.error(`Error killing process ${pid}: ${killError.message}`);
          } else {
            killedCount++;
            console.log(`Stopped process with PID ${pid}`);
          }
          
          if (killedCount === pids.length) {
            console.log('All processes stopped.');
            resolve();
          }
        });
      });
    });
  });
};

// Start a new frontend server
const startFrontendServer = () => {
  console.log('Starting a new frontend server...');
  
  // Get the project root directory
  const projectDir = __dirname;
  
  // Ensure correct working directory
  process.chdir(projectDir);
  
  // Start the frontend server
  const frontendProcess = exec('npm run dev');
  
  // Forward the output
  frontendProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  frontendProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  frontendProcess.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
  });
  
  console.log('Frontend server started successfully!');
};

// Start a new backend server
const startBackendServer = () => {
  console.log('Starting a new backend server...');
  
  // Get the server directory
  const serverDir = path.join(__dirname, 'server');
  
  // Ensure correct working directory
  process.chdir(serverDir);
  
  // Start the backend server
  const backendProcess = exec('npm run dev');
  
  // Forward the output
  backendProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  backendProcess.on('close', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });
  
  console.log('Backend server started successfully!');
};

// Main function
const main = async () => {
  try {
    await findAndKillProcesses();
    
    // Wait a moment to ensure ports are freed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start both servers
    startBackendServer();
    
    // Wait a moment before starting frontend to ensure backend is up
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    startFrontendServer();
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
};

// Run the script
main(); 