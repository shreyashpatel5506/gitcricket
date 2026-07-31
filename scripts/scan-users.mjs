#!/usr/bin/env node

/**
 * GitCricket User Scanner & Card Generator
 * Automates fetching active GitHub users from multiple countries and triggering
 * card generation on your live Vercel deployment.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Supported countries to ensure a diverse distribution
const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Brazil',
  'Japan',
  'France',
  'Australia',
  'Netherlands',
  'Ukraine',
  'Singapore',
  'Indonesia',
  'Spain',
  'Nigeria',
  'Pakistan',
  'Bangladesh',
  'Vietnam',
  'Turkey',
  'Russia'
];

// Simple helper to parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: 'https://gitcricket.vercel.app',
    count: 50, // default 50 per country -> 1000 users total
    open: false,
    delay: 1500 // milliseconds between requests to avoid overloading Vercel/DB
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' || args[i] === '-u') {
      options.url = args[i + 1]?.replace(/\/$/, '') || options.url;
      i++;
    } else if (args[i] === '--count' || args[i] === '-c') {
      options.count = parseInt(args[i + 1], 10) || options.count;
      i++;
    } else if (args[i] === '--open' || args[i] === '-o') {
      options.open = true;
    } else if (args[i] === '--delay' || args[i] === '-d') {
      options.delay = parseInt(args[i + 1], 10) || options.delay;
      i++;
    }
  }

  return options;
}

// Read env variables from .env.local file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env.local file not found in the current directory.');
    return {};
  }
  
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index > 0) {
      const key = trimmed.slice(0, index).trim();
      let val = trimmed.slice(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
  return env;
}

// Extract existing scanned users from gitcricket_users.md to avoid duplicate requests
function loadScannedUsers() {
  const scanned = new Set();
  const filePath = path.resolve(process.cwd(), 'gitcricket_users.md');
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Regex matches Markdown list links: - [username](url)
    const matches = content.matchAll(/- \[(.+?)\]\(https:\/\/[^)]+\)/g);
    for (const match of matches) {
      scanned.add(match[1].toLowerCase().trim());
    }
  }
  
  return scanned;
}

// Append a successfully scanned user to the output file
function saveScannedUser(username, profileUrl, country) {
  const filePath = path.resolve(process.cwd(), 'gitcricket_users.md');
  const cleanUsername = username.trim();
  const entry = `- [${cleanUsername}](${profileUrl}) (${country})\n`;
  
  if (!fs.existsSync(filePath)) {
    const header = `# GitCricket Scanned Users List\n\nGenerated links to your Vercel deployment:\n\n`;
    fs.writeFileSync(filePath, header + entry, 'utf-8');
  } else {
    fs.appendFileSync(filePath, entry, 'utf-8');
  }
}

// Fetch usernames from GitHub search API for a specific country
async function fetchUsernamesFromCountry(country, count, githubToken) {
  const usernames = [];
  const perPage = Math.min(count, 100);
  const pagesNeeded = Math.ceil(count / perPage);
  
  console.log(`🔍 [GitHub Search] Fetching top ${count} users from location: "${country}"...`);
  
  for (let page = 1; page <= pagesNeeded; page++) {
    // Search query: location, repos > 5, sorted by followers
    const q = `location:"${country}" repos:>5`;
    const url = `https://api.github.com/search/users?q=${encodeURIComponent(q)}&sort=followers&order=desc&per_page=${perPage}&page=${page}`;
    
    const headers = {
      'User-Agent': 'GitCricket-Scanner'
    };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error(`  ❌ GitHub Search Error: ${res.status} - ${errData.message || res.statusText}`);
        break;
      }
      
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        const batch = data.items.map(item => item.login);
        usernames.push(...batch);
        console.log(`  └─ Found ${batch.length} users on page ${page}`);
      }
      
      // Wait to respect search API limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(`  ❌ GitHub Search failed: ${err.message}`);
      break;
    }
  }
  
  return usernames.slice(0, count);
}

// Open URL in Chrome/Default browser
async function openBrowser(url) {
  const command = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
      
  await execAsync(command).catch(err => {
    console.warn(`  ⚠️ Failed to open browser window: ${err.message}`);
  });
}

// Main execution function
async function main() {
  const options = parseArgs();
  const env = loadEnv();
  const token = env.GITHUB_TOKEN || env.GITHUB_PAT;

  console.clear();
  console.log(`====================================================`);
  console.log(`🏏  GitCricket Mass Card Generator & Scanner`);
  console.log(`====================================================`);
  console.log(`🌐 Target Vercel App: ${options.url}`);
  console.log(`👥 Target Count per Country: ${options.count}`);
  console.log(`⏱️  Request Delay: ${options.delay}ms`);
  console.log(`🖥️  Open in Chrome: ${options.open ? 'ENABLED ⚠️' : 'DISABLED'}`);
  console.log(`🔑 GitHub Token: ${token ? 'Configured ✅' : 'Missing ⚠️ (Will use unauthenticated API limit)'}`);
  console.log(`====================================================\n`);

  if (options.open) {
    console.warn(`⚠️  WARNING: You enabled Chrome opening (--open).`);
    console.warn(`   This will open pages in Chrome. To avoid crashing your system,`);
    console.warn(`   make sure count is set small or be prepared to close tabs periodically!\n`);
  }

  const scannedSet = loadScannedUsers();
  console.log(`📂 Loaded ${scannedSet.size} already scanned users from gitcricket_users.md\n`);

  let totalProcessed = 0;
  let totalSuccessful = 0;

  for (const country of COUNTRIES) {
    console.log(`\n🌍 Processing Country: ${country}`);
    const usernames = await fetchUsernamesFromCountry(country, options.count, token);
    
    if (usernames.length === 0) {
      console.log(`  ⚠️ No users found or error fetching users for ${country}. Skipping.`);
      continue;
    }

    for (const username of usernames) {
      const lowerUsername = username.toLowerCase();
      totalProcessed++;

      if (scannedSet.has(lowerUsername)) {
        console.log(`  [${totalProcessed}] ⏭️ Skipping @${username} (Already scanned)`);
        continue;
      }

      const targetProfileUrl = `${options.url}/${username}`;
      const targetApiUrl = `${options.url}/api/github/fetchPublicData?username=${username}`;

      console.log(`  [${totalProcessed}] ⚡ Scanning @${username} (${country})...`);

      try {
        // Trigger server-side card generation by calling the API endpoint
        const start = Date.now();
        const res = await fetch(targetApiUrl);
        const duration = Date.now() - start;

        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            totalSuccessful++;
            console.log(`    ✅ Success! (OVR: ${result.card?.overall || 'N/A'}, Role: ${result.card?.player_role || 'N/A'}) - ${duration}ms`);
            
            // Save link to local file
            saveScannedUser(username, targetProfileUrl, country);
            scannedSet.add(lowerUsername);

            // If --open flag is set, open in the browser
            if (options.open) {
              await openBrowser(targetProfileUrl);
            }
          } else {
            console.error(`    ❌ Server Error: ${result.error || 'Unknown error'}`);
          }
        } else {
          console.error(`    ❌ HTTP Error: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error(`    ❌ Connection failed: ${err.message}`);
      }

      // Respect the delay spacing between profile generations
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }

  console.log(`\n====================================================`);
  console.log(`🎉 Scanning completed!`);
  console.log(`📈 Total Processed in this run: ${totalProcessed}`);
  console.log(`⭐ Total Successful New Cards: ${totalSuccessful}`);
  console.log(`📄 Saved list to: gitcricket_users.md`);
  console.log(`====================================================`);
}

main().catch(err => {
  console.error('Fatal Script Error:', err);
});
