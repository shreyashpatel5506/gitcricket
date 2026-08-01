// Script to automate daily issue creation for location mapping
const REPO = 'shreyashpatel5506/gitcricket';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// List of all target countries
const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal",
  "France", "Japan", "Netherlands", "Singapore", "Brazil",
  "Russia", "China", "South Africa", "New Zealand", "Switzerland",
  "Sweden", "Spain", "Italy", "Ukraine", "Poland",
  "Turkey", "Indonesia", "Vietnam", "Philippines", "Malaysia",
  "Thailand", "South Korea", "Nigeria", "Kenya", "Egypt",
  "Israel", "Mexico", "Argentina", "Colombia", "Ireland",
  "Austria", "Belgium", "Denmark", "Finland", "Norway",
  "Portugal", "Romania", "United Arab Emirates", "Saudi Arabia", "Greece",
  "Czech Republic", "Hungary", "Taiwan", "Hong Kong", "Iran",
  "Morocco", "Algeria", "Tunisia", "Ghana", "Chile",
  "Peru", "Venezuela", "Ecuador", "Uruguay", "Costa Rica",
  "Panama", "Dominican Republic", "Puerto Rico", "Cuba", "Kazakhstan",
  "Uzbekistan", "Azerbaijan", "Georgia", "Armenia", "Belarus",
  "Bulgaria", "Croatia", "Serbia", "Slovakia", "Slovenia",
  "Lithuania", "Latvia", "Estonia", "Iceland", "Luxembourg",
  "Cyprus", "Malta", "Iraq", "Jordan", "Lebanon",
  "Kuwait", "Qatar", "Oman", "Bahrain", "Myanmar",
  "Cambodia", "Laos", "Mongolia", "Jamaica", "Trinidad and Tobago",
  "Zimbabwe", "Uganda", "Ethiopia", "Tanzania", "Senegal",
  "Ivory Coast", "Cameroon", "Angola", "Mozambique", "Madagascar"
];

async function run() {
  if (!GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is not defined!');
    process.exit(1);
  }

  console.log(`🌐 Querying existing issues for repo: ${REPO}...`);

  // 1. Fetch existing issues matching location-mapping label
  const searchUrl = `https://api.github.com/search/issues?q=repo:${REPO}+label:location-mapping+type:issue`;

  const searchResponse = await fetch(searchUrl, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitCricket-Issue-Bot'
    }
  });

  if (!searchResponse.ok) {
    console.error(`❌ Failed to search issues: ${searchResponse.statusText}`);
    const errText = await searchResponse.text();
    console.error(errText);
    process.exit(1);
  }

  const searchData = await searchResponse.json();
  const existingIssues = searchData.items || [];

  // Extract country names that already have issues (open or closed)
  const existingCountries = new Set();
  existingIssues.forEach(issue => {
    // Match "Expand location mapping list for [Country]"
    const match = issue.title.match(/Expand location mapping list for (.+)$/i);
    if (match) {
      existingCountries.add(match[1].trim().toLowerCase());
    }
  });

  console.log(`ℹ️ Found ${existingCountries.size} countries already mapped/issues created.`);

  // 2. Identify the first 3 countries that do not have issues created yet
  const targets = [];
  for (const country of countries) {
    if (!existingCountries.has(country.toLowerCase())) {
      targets.push(country);
      if (targets.length === 5) break; // Create 3 issues per day
    }
  }

  if (targets.length === 0) {
    console.log('🎉 All countries have existing issues! No new issues to create.');
    return;
  }

  console.log(`🚀 Creating issues for: ${targets.join(', ')}`);

  // 3. Create issues
  for (const country of targets) {
    const title = `chore: Expand location mapping list for ${country}`;
    const countryLower = country.toLowerCase();

    const body = `### 🏏 Description
We are expanding our offline city/state/country resolution engine inside GitCricket! 

To help developers from **${country}** get ranked correctly under their country profile leaderboard, we need to map their local cities, states, and alternative country names in lowercase.

### ⚠️ IMPORTANT: Where to make changes?
Please make changes **ONLY** in this file and inside the specific country object:
📂 **Target File:** [features/scanner/utils/transformer.js](https://github.com/shreyashpatel5506/gitcricket/blob/main/features/scanner/utils/transformer.js)

Look for the object with \`name: '${country}'\` in the \`countryLookup\` array and append missing cities or states (in **lowercase**):
\`\`\`javascript
  {
    name: '${country}',
    patterns: [
      '${countryLower}',
      // Add more local cities and states here in lowercase...
    ]
  }
\`\`\`

Do **not** edit any other files or make changes outside this specific array object.

---

### ⭐ Please Star the Repository!
If you submit a Pull Request to fix this issue, **please star the repository**! 
Starring the repo shows your support and gives your Pull Request a **much higher chance of being reviewed and merged quickly!** 🚀

---

### 🤝 Getting Started
- Fork the repository.
- Create a new branch (e.g., \`location/${countryLower.replace(/\s+/g, '-')}\`).
- Make changes in \`features/scanner/utils/transformer.js\`.
- Run \`npm run build\` locally to verify that there are no compilation errors.
- Submit your Pull Request and reference this issue!`;

    const createUrl = `https://api.github.com/repos/${REPO}/issues`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'GitCricket-Issue-Bot'
      },
      body: JSON.stringify({
        title,
        body,
        labels: ['good first issue', 'help wanted', 'location-mapping']
      })
    });

    if (createResponse.ok) {
      const issueData = await createResponse.json();
      console.log(`✅ Successfully created Issue #${issueData.number} for ${country}: ${issueData.html_url}`);
    } else {
      console.error(`❌ Failed to create issue for ${country}: ${createResponse.statusText}`);
      const errText = await createResponse.text();
      console.error(errText);
    }
  }
}

run();
