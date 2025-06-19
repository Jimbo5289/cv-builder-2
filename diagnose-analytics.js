#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

console.log('🔍 Google Analytics Configuration Diagnostic\n');

// Test 1: Check local files
function checkLocalFiles() {
  console.log('📁 Local Files Check:');
  
  try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const hasPlaceholder = indexHtml.includes('GA_MEASUREMENT_ID_PLACEHOLDER');
    const hasGoogleAnalytics = indexHtml.includes('Google Analytics');
    
    console.log(`   ✓ index.html exists: ✅`);
    console.log(`   ✓ Has GA placeholder: ${hasPlaceholder ? '✅' : '❌'}`);
    console.log(`   ✓ Has GA comment: ${hasGoogleAnalytics ? '✅' : '❌'}`);
    
    if (hasPlaceholder) {
      const placeholderCount = (indexHtml.match(/GA_MEASUREMENT_ID_PLACEHOLDER/g) || []).length;
      console.log(`   ✓ Placeholder instances: ${placeholderCount}`);
    }
  } catch (e) {
    console.log('   ❌ Could not read index.html:', e.message);
  }
  
  try {
    const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
    const hasPlugin = viteConfig.includes('injectGoogleAnalytics');
    const hasEnvAccess = viteConfig.includes('env.VITE_GA_MEASUREMENT_ID');
    
    console.log(`   ✓ Has Vite plugin: ${hasPlugin ? '✅' : '❌'}`);
    console.log(`   ✓ Accesses env variable: ${hasEnvAccess ? '✅' : '❌'}`);
  } catch (e) {
    console.log('   ❌ Could not read vite.config.js:', e.message);
  }
}

// Test 2: Check live deployment
function checkLiveDeployment() {
  return new Promise((resolve) => {
    console.log('\n🌐 Live Deployment Check:');
    
    https.get('https://mycvbuilder.co.uk', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // Check for various GA indicators
        const hasGtag = data.includes('gtag');
        const hasGoogletagmanager = data.includes('googletagmanager.com');
        const hasDataLayer = data.includes('dataLayer');
        const hasGoogleAnalytics = data.includes('Google Analytics');
        const gaIdMatch = data.match(/G-[A-Z0-9]{10}/g);
        const placeholderExists = data.includes('GA_MEASUREMENT_ID_PLACEHOLDER');
        
        console.log(`   ✓ Has gtag function: ${hasGtag ? '✅' : '❌'}`);
        console.log(`   ✓ Has googletagmanager script: ${hasGoogletagmanager ? '✅' : '❌'}`);
        console.log(`   ✓ Has dataLayer: ${hasDataLayer ? '✅' : '❌'}`);
        console.log(`   ✓ Has GA comment: ${hasGoogleAnalytics ? '✅' : '❌'}`);
        console.log(`   ✓ Placeholder replaced: ${!placeholderExists ? '✅' : '❌ Still has placeholder'}`);
        
        if (gaIdMatch && gaIdMatch.length > 0) {
          console.log(`   ✓ GA Measurement ID(s): ${gaIdMatch.join(', ')}`);
        } else {
          console.log(`   ❌ No GA Measurement ID found`);
        }
        
        // Extract head section for analysis
        const headMatch = data.match(/<head[^>]*>(.*?)<\/head>/s);
        if (headMatch) {
          const headContent = headMatch[1];
          const scriptsInHead = (headContent.match(/<script/g) || []).length;
          console.log(`   ✓ Scripts in head: ${scriptsInHead}`);
          
          if (headContent.includes('Google Analytics')) {
            console.log(`   ✅ GA section found in head`);
          } else {
            console.log(`   ❌ No GA section in head`);
          }
        }
        
        resolve({
          hasGtag,
          hasGoogletagmanager,
          gaIds: gaIdMatch,
          placeholderExists,
          responseSize: data.length
        });
      });
    }).on('error', (err) => {
      console.log(`   ❌ Error fetching site: ${err.message}`);
      resolve(null);
    });
  });
}

// Test 3: Check Vercel deployment specifically
function checkVercelDirect() {
  return new Promise((resolve) => {
    console.log('\n🚀 Vercel Direct Check:');
    
    // Try multiple Vercel URLs
    const vercelUrls = [
      'https://cv-builder-2-jimbo5289s-projects.vercel.app/',
      'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app/',
      'https://cv-builder-2-latest.vercel.app/'
    ];
    
    let completed = 0;
    const results = [];
    
    vercelUrls.forEach((url, index) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const hasGA = data.includes('gtag') || data.includes('googletagmanager');
          const gaId = data.match(/G-[A-Z0-9]{10}/);
          
          console.log(`   URL ${index + 1}: ${hasGA ? '✅ Has GA' : '❌ No GA'} ${gaId ? `(${gaId[0]})` : ''}`);
          results.push({ url, hasGA, gaId: gaId ? gaId[0] : null });
          
          completed++;
          if (completed === vercelUrls.length) {
            resolve(results);
          }
        });
      }).on('error', (err) => {
        console.log(`   URL ${index + 1}: ❌ Error - ${err.message}`);
        completed++;
        if (completed === vercelUrls.length) {
          resolve(results);
        }
      });
    });
  });
}

// Test 4: Provide recommendations
function provideRecommendations(liveResult) {
  console.log('\n📋 Recommendations:');
  
  if (!liveResult) {
    console.log('   ❌ Could not analyze live site');
    return;
  }
  
  if (liveResult.placeholderExists) {
    console.log('   🔧 Issue: GA placeholder not replaced');
    console.log('      → Check Vercel environment variable: VITE_GA_MEASUREMENT_ID');
    console.log('      → Verify the variable is set for Production environment');
    console.log('      → Trigger a new deployment after setting the variable');
  }
  
  if (!liveResult.hasGtag && !liveResult.hasGoogletagmanager) {
    console.log('   🔧 Issue: No Google Analytics code found');
    console.log('      → The Vite plugin may not be running during build');
    console.log('      → Check build logs for plugin errors');
    console.log('      → Verify the plugin is in the plugins array');
  }
  
  if (liveResult.gaIds && liveResult.gaIds.length > 0) {
    console.log('   ✅ Google Analytics appears to be configured!');
    console.log('   📊 If not seeing traffic, check:');
    console.log('      → Wait 24-48 hours for data to appear');
    console.log('      → Check GA Real-time reports for immediate data');
    console.log('      → Verify the GA property is correctly configured for your domain');
    console.log('      → Check browser dev tools for GA network requests');
  }
}

// Run all tests
async function runDiagnostic() {
  checkLocalFiles();
  const liveResult = await checkLiveDeployment();
  await checkVercelDirect();
  provideRecommendations(liveResult);
  
  console.log('\n🎯 Quick Test Commands:');
  console.log('   # Check for GA in live site:');
  console.log('   curl -s https://mycvbuilder.co.uk | grep -i "gtag\\|analytics"');
  console.log('   ');
  console.log('   # Check browser dev tools:');
  console.log('   1. Visit https://mycvbuilder.co.uk');
  console.log('   2. Open dev tools → Network tab');
  console.log('   3. Look for requests to "googletagmanager.com"');
}

runDiagnostic().catch(console.error); 