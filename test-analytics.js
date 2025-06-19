#!/usr/bin/env node

console.log('🔍 Testing Google Analytics Configuration...\n');

// Test 1: Check if GA code exists in live site
const https = require('https');

function testLiveSite() {
  return new Promise((resolve) => {
    https.get('https://mycvbuilder.co.uk', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const hasGtag = data.includes('gtag');
        const hasGA4 = data.includes('googletagmanager.com');
        const gaId = data.match(/G-[A-Z0-9]{10}/);
        
        console.log('📊 Live Site Analysis:');
        console.log(`   ✓ Has gtag function: ${hasGtag ? '✅' : '❌'}`);
        console.log(`   ✓ Has GA4 script: ${hasGA4 ? '✅' : '❌'}`);
        console.log(`   ✓ GA Measurement ID: ${gaId ? gaId[0] : '❌ Not found'}`);
        
        resolve({ hasGtag, hasGA4, gaId: gaId ? gaId[0] : null });
      });
    });
  });
}

// Test 2: Check local configuration
function testLocalConfig() {
  const fs = require('fs');
  
  console.log('\n🔧 Local Configuration:');
  
  // Check if placeholder exists in index.html
  try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const hasPlaceholder = indexHtml.includes('GA_MEASUREMENT_ID_PLACEHOLDER');
    console.log(`   ✓ HTML placeholder: ${hasPlaceholder ? '✅' : '❌'}`);
  } catch (e) {
    console.log('   ❌ Could not read index.html');
  }
  
  // Check vite config
  try {
    const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
    const hasPlugin = viteConfig.includes('injectGoogleAnalytics');
    console.log(`   ✓ Vite plugin: ${hasPlugin ? '✅' : '❌'}`);
  } catch (e) {
    console.log('   ❌ Could not read vite.config.js');
  }
}

async function runTests() {
  testLocalConfig();
  await testLiveSite();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Get your GA4 Measurement ID from Google Analytics');
  console.log('2. Add VITE_GA_MEASUREMENT_ID to Vercel environment variables');
  console.log('3. Redeploy and test again');
}

runTests().catch(console.error); 