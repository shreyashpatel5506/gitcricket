import {
  calculateBatting,
  calculateBowling,
  calculateFielding,
  calculateTechnique,
  calculateFitness,
  calculateExperience,
  determinePlayerRole,
  calculateOverall
} from './ratingEngine.js';

/**
 * Calculates current and longest streaks from the contribution calendar.
 */
function calculateStreaks(weeks) {
  if (!weeks || weeks.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Flatten weeks and weeks' contributionDays to a single sorted array of days
  const days = weeks
    .flatMap(w => w.contributionDays || [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 1. Calculate Longest Streak
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // 2. Calculate Current Streak (scanning backwards from today)
  let currentStreak = 0;
  let streakActive = true;
  const reversedDays = [...days].reverse();

  // Find start index: today (index 0) or yesterday (index 1)
  // If both today and yesterday have 0 commits, the streak is broken.
  let startIndex = 0;
  if (reversedDays.length > 0 && reversedDays[0].contributionCount === 0) {
    if (reversedDays.length > 1 && reversedDays[1].contributionCount > 0) {
      startIndex = 1;
    } else {
      streakActive = false;
    }
  }

  if (streakActive) {
    for (let i = startIndex; i < reversedDays.length; i++) {
      if (reversedDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Summarizes language size distributions from repository nodes.
 */
function aggregateLanguages(repoNodes) {
  const languageSizes = {};

  if (repoNodes && repoNodes.length > 0) {
    repoNodes.forEach(repo => {
      const edges = repo.languages?.edges || [];
      edges.forEach(edge => {
        const langName = edge.node?.name;
        const size = edge.size || 0;
        if (langName) {
          languageSizes[langName] = (languageSizes[langName] || 0) + size;
        }
      });
    });
  }

  // Sort languages by total size descending
  return Object.keys(languageSizes)
    .sort((a, b) => languageSizes[b] - languageSizes[a]);
}

/**
 * Parses location string and resolves clean country name. Defaults to India.
 */
function extractCountry(location) {
  if (!location) return 'India';
  const loc = location.toLowerCase().trim();

  if (loc.includes('india') || loc.includes(', in') || loc === 'in' || loc.includes('bharat')) return 'India';
  if (loc.includes('united states') || loc.includes('usa') || loc.includes(', us') || loc === 'us') return 'United States';
  if (loc.includes('united kingdom') || loc.includes('uk') || loc === 'uk' || loc.includes('london')) return 'United Kingdom';
  if (loc.includes('canada') || loc === 'ca') return 'Canada';
  if (loc.includes('australia') || loc === 'au') return 'Australia';
  if (loc.includes('germany') || loc === 'de') return 'Germany';
  if (loc.includes('singapore') || loc === 'sg') return 'Singapore';

  const parts = location.split(',');
  if (parts.length > 1) {
    const candidate = parts[parts.length - 1].trim();
    if (candidate.length > 2) return candidate;
  }

  return 'India';
}

/**
 * Parses city and state from GitHub's location field.
 * Example: "Mumbai, Maharashtra, India" -> { city: "Mumbai", state: "Maharashtra" }
 * Example: "San Francisco, CA" -> { city: "San Francisco", state: "CA" }
 */
function parseCityAndState(location) {
  if (!location) return { city: null, state: null };
  const parts = location.split(',').map(p => p.trim());
  
  let city = null;
  let state = null;
  
  if (parts.length > 0) {
    city = parts[0];
  }
  if (parts.length > 1) {
    state = parts[1];
  }
  
  return { city, state };
}

/**
 * Classifies the company field into either a corporate company or a university/college.
 * If the string contains keywords like 'university', 'college', 'iit', 'school', etc.,
 * it classifies as a college. Otherwise, it cleans standard @ symbols and maps it as a company.
 */
function parseCompanyAndCollege(company) {
  if (!company) return { company: null, college: null };
  
  const cleanName = company.trim().replace(/^@/, '');
  const lower = cleanName.toLowerCase();
  
  const collegeKeywords = [
    'university', 'college', 'institute', 'school', 'iit', 'mit', 
    'iiit', 'bits', 'harvard', 'stanford', 'oxford', 'cambridge', 
    'polytechnic', 'acad', 'tech'
  ];
  
  const isCollege = collegeKeywords.some(keyword => lower.includes(keyword));
  
  if (isCollege) {
    return { company: null, college: cleanName };
  }
  
  return { company: cleanName, college: null };
}

/**
 * Transforms raw GitHub user data from GraphQL into structured profile cache and card ratings.
 */
export function transformGitHubData(user) {
  // 1. Core aggregations from repo nodes
  const repoNodes = user.repositories?.nodes || [];
  const totalStars = repoNodes.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
  const totalForks = repoNodes.reduce((sum, r) => sum + (r.forkCount || 0), 0);
  const sortedLanguages = aggregateLanguages(repoNodes);

  // 2. Contributions collection
  const contributions = user.contributionsCollection || {};
  const commitsCount = contributions.totalCommitContributions || 0;
  const prsCount = contributions.totalPullRequestContributions || 0;
  const issuesClosed = contributions.totalIssueContributions || 0;
  const prReviews = contributions.totalPullRequestReviewContributions || 0;

  // Calculate career commits across all repositories all-time
  const totalCommitsAllTime = repoNodes.reduce((sum, r) => {
    return sum + (r.defaultBranchRef?.target?.history?.totalCount || 0);
  }, 0);

  // Define totalContributions as career-wide sum (commits, PRs, issues, reviews)
  const totalContributions = Math.max(
    contributions.contributionCalendar?.totalContributions || 0,
    totalCommitsAllTime + prsCount + issuesClosed + prReviews
  );

  // 3. Streak calculations
  const calendarWeeks = contributions.contributionCalendar?.weeks || [];
  const { currentStreak, longestStreak } = calculateStreaks(calendarWeeks);

  // 4. Time calculations (Experience)
  const createdAtDate = new Date(user.createdAt);
  const diffTime = Math.abs(new Date() - createdAtDate);
  const yearsActive = Math.max(1, diffTime / (1000 * 60 * 60 * 24 * 365.25));

  // 5. Run Rating Calculations
  const batting = calculateBatting(totalContributions, totalStars);
  const bowling = calculateBowling(issuesClosed, totalForks);
  const fielding = calculateFielding(prReviews, user.following?.totalCount || 0);
  const technique = calculateTechnique(prsCount, commitsCount, sortedLanguages.length);
  const fitness = calculateFitness(currentStreak, longestStreak);
  const experience = calculateExperience(yearsActive);

  // 6. Determine Role
  const playerRole = determinePlayerRole({
    batting,
    bowling,
    fielding,
    technique,
    experience,
    prReviews,
    issuesClosed,
    orgCount: user.organizations?.totalCount || 0,
    followers: user.followers?.totalCount || 0,
    stars: totalStars,
    commitsCount,
    languages: sortedLanguages
  });

  // 7. Calculate Overall Rating
  const overall = calculateOverall(
    batting,
    bowling,
    fielding,
    technique,
    fitness,
    experience,
    playerRole
  );

  const { city, state } = parseCityAndState(user.location);
  const { company, college } = parseCompanyAndCollege(user.company);
  const primaryLang = sortedLanguages[0] || null;

  // Prepare profile cache schema
  const profileCache = {
    github_username: user.login,
    github_id: user.databaseId,
    name: user.name || user.login,
    avatar_url: user.avatarUrl,
    bio: user.bio || '',
    country: extractCountry(user.location),
    city,
    state,
    company,
    college,
    primary_language: primaryLang,
    followers: user.followers?.totalCount || 0,
    following: user.following?.totalCount || 0,
    public_repos: user.repositories?.totalCount || 0,
    total_stars: totalStars,
    total_forks: totalForks,
    contribution_count: totalContributions,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    account_created_at: user.createdAt,
    raw_graphql: user,
    cached_at: new Date().toISOString()
  };

  // Prepare card ratings schema
  const cardRatings = {
    overall,
    batting,
    bowling,
    fielding,
    fitness,
    technique,
    experience,
    player_role: playerRole,
    favorite_shot: sortedLanguages[0] || 'Cover Drive', // default cover drive if no language
    languages: sortedLanguages
  };

  return {
    profileCache,
    cardRatings
  };
}
