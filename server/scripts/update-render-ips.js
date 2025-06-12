const { EC2Client, DescribeSecurityGroupsCommand, AuthorizeSecurityGroupIngressCommand, RevokeSecurityGroupIngressCommand } = require('@aws-sdk/client-ec2');
const https = require('https');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// AWS Configuration
const REGION = process.env.AWS_REGION || 'eu-central-1';
const SECURITY_GROUP_ID = process.env.AWS_RDS_SECURITY_GROUP_ID;
const RENDER_IP_LIST_FILE = path.resolve(__dirname, '../data/render-ips.json');

// Create the EC2 client
const ec2Client = new EC2Client({ region: REGION });

// Ensure the data directory exists
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Function to get current IPs from Render
async function getRenderIPs() {
  console.log('Getting current IPs from Render...');
  
  // Simulated approach - in production, you would:
  // 1. Use a fetch to Render's public IP endpoints (if they exist)
  // 2. Or use the outbound IP from your server for the current deployment

  // For now, we'll check our current outbound IP
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve([data.trim()]);
      });
    }).on('error', (err) => {
      console.error('Error detecting outbound IP:', err);
      reject(err);
    });
  });
}

// Function to load previously saved Render IPs
function getPreviousRenderIPs() {
  try {
    if (fs.existsSync(RENDER_IP_LIST_FILE)) {
      const data = fs.readFileSync(RENDER_IP_LIST_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading previous Render IPs:', error);
  }
  return { ips: [], lastUpdated: null };
}

// Function to save current Render IPs
function saveRenderIPs(ips) {
  try {
    const data = {
      ips,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(RENDER_IP_LIST_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving Render IPs:', error);
  }
}

// Function to get current security group rules
async function getSecurityGroupRules() {
  console.log(`Getting current rules for security group ${SECURITY_GROUP_ID}...`);
  
  try {
    const command = new DescribeSecurityGroupsCommand({
      GroupIds: [SECURITY_GROUP_ID]
    });
    
    const response = await ec2Client.send(command);
    return response.SecurityGroups[0];
  } catch (error) {
    console.error('Error getting security group rules:', error);
    throw error;
  }
}

// Function to add a new IP to the security group
async function addIPToSecurityGroup(ip) {
  console.log(`Adding IP ${ip} to security group ${SECURITY_GROUP_ID}...`);
  
  try {
    const command = new AuthorizeSecurityGroupIngressCommand({
      GroupId: SECURITY_GROUP_ID,
      IpPermissions: [
        {
          IpProtocol: 'tcp',
          FromPort: 5432,
          ToPort: 5432,
          IpRanges: [
            {
              CidrIp: `${ip}/32`,
              Description: 'Render Backend Server'
            }
          ]
        }
      ]
    });
    
    await ec2Client.send(command);
    console.log(`Successfully added IP ${ip} to security group`);
    return true;
  } catch (error) {
    if (error.name === 'InvalidPermission.Duplicate') {
      console.log(`IP ${ip} already exists in security group`);
      return true;
    }
    console.error(`Error adding IP ${ip} to security group:`, error);
    return false;
  }
}

// Function to remove an IP from the security group
async function removeIPFromSecurityGroup(ip) {
  console.log(`Removing IP ${ip} from security group ${SECURITY_GROUP_ID}...`);
  
  try {
    const command = new RevokeSecurityGroupIngressCommand({
      GroupId: SECURITY_GROUP_ID,
      IpPermissions: [
        {
          IpProtocol: 'tcp',
          FromPort: 5432,
          ToPort: 5432,
          IpRanges: [
            {
              CidrIp: `${ip}/32`
            }
          ]
        }
      ]
    });
    
    await ec2Client.send(command);
    console.log(`Successfully removed IP ${ip} from security group`);
    return true;
  } catch (error) {
    console.error(`Error removing IP ${ip} from security group:`, error);
    return false;
  }
}

// Main function to update security group with current Render IPs
async function updateSecurityGroupWithRenderIPs() {
  if (!SECURITY_GROUP_ID) {
    console.error('AWS_RDS_SECURITY_GROUP_ID environment variable is not set');
    return;
  }

  try {
    // Get current Render IPs
    const currentIPs = await getRenderIPs();
    console.log('Current Render IPs:', currentIPs);
    
    // Get previously saved Render IPs
    const { ips: previousIPs } = getPreviousRenderIPs();
    console.log('Previous Render IPs:', previousIPs);
    
    // Add new IPs to security group
    for (const ip of currentIPs) {
      if (!previousIPs.includes(ip)) {
        await addIPToSecurityGroup(ip);
      }
    }
    
    // Remove old IPs from security group (optional - only if you want to clean up)
    // Uncomment this if you want to remove old IPs
    /*
    for (const ip of previousIPs) {
      if (!currentIPs.includes(ip)) {
        await removeIPFromSecurityGroup(ip);
      }
    }
    */
    
    // Save current IPs for future comparison
    saveRenderIPs(currentIPs);
    
    console.log('Security group update completed');
  } catch (error) {
    console.error('Error updating security group with Render IPs:', error);
  }
}

// Run the script
updateSecurityGroupWithRenderIPs().catch(console.error);

module.exports = { updateSecurityGroupWithRenderIPs }; 