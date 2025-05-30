const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get all running node processes
const findAndKillNodeProcesses = () => {
  return new Promise((resolve) => {
    console.log('Checking for running Node servers...');
    
    // Different commands for different OS
    const command = process.platform === 'win32'
      ? 'tasklist /fi "imagename eq node.exe" /fo csv /nh'
      : 'ps aux | grep node';
      
    exec(command, (error, stdout) => {
      if (error) {
        console.error(`Error finding Node processes: ${error.message}`);
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
          if (line.includes('node') && !line.includes('grep')) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
              pids.push(parts[1]);
            }
          }
        });
      }
      
      if (pids.length === 0) {
        console.log('No Node.js processes found running on ports 3005-3009');
        resolve();
        return;
      }
      
      // Kill each process
      console.log(`Found ${pids.length} Node.js processes. Stopping...`);
      
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
            console.log('All Node processes stopped.');
            resolve();
          }
        });
      });
    });
  });
};

// Start a new server
const startNewServer = () => {
  console.log('Starting a new server...');
  
  // Get the directory of this script
  const serverDir = __dirname;
  
  // Ensure correct working directory
  process.chdir(serverDir);
  
  // Start the server using npm run dev
  const serverProcess = exec('npm run dev');
  
  // Forward the output
  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });
  
  console.log('Server started successfully!');
};

// Main function
const main = async () => {
  try {
    await findAndKillNodeProcesses();
    
    // Wait a moment to ensure ports are freed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    startNewServer();
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
};

// Run the script
main(); 