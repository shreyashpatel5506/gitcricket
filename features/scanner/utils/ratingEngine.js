/**
 * GitCric Rating Engine
 * Calculates player ratings (30-99) and determines their cricket roles based on GitHub data.
 */

// Helper to safely clamp values between min (default 30) and max (default 99)
function clamp(value, min = 30, max = 99) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Calculates Batting Rating (Power & Volume)
 * Uses total contributions (volume) and stargazers (sixes / boundary hits)
 */
export function calculateBatting(contributions, stars) {
  // log_1.5(x) = ln(x) / ln(1.5)
  const volBase = Math.log(contributions + 1) / Math.log(1.5);
  // log_2(x) = ln(x) / ln(2)
  const powerBonus = Math.log(stars + 1) / Math.log(2);
  
  const rawScore = 30 + volBase * 5 + powerBonus * 3;
  return clamp(rawScore);
}

/**
 * Calculates Bowling Rating (Control & Wicket-taking)
 * Uses issues closed (wickets) and forks (partnerships/modularity)
 */
export function calculateBowling(issuesClosed, forks) {
  // log_1.8(x) = ln(x) / ln(1.8)
  const wicketBase = Math.log(issuesClosed + 1) / Math.log(1.8);
  // log_2.5(x) = ln(x) / ln(2.5)
  const controlBonus = Math.log(forks + 1) / Math.log(2.5);
  
  const rawScore = 30 + wicketBase * 6 + controlBonus * 2;
  return clamp(rawScore);
}

/**
 * Calculates Fielding Rating (Team Support)
 * Uses pull request reviews (saving runs/guiding code) and following ratio
 */
export function calculateFielding(prReviews, following) {
  const reviewScore = prReviews * 2.5;
  const networkBonus = Math.log(following + 1) / Math.log(2) * 3;
  
  const rawScore = 30 + reviewScore + networkBonus;
  return clamp(rawScore);
}

/**
 * Calculates Technique Rating (Code quality and versatility)
 * Uses PRs-to-commits ratio (clean coding) and language diversity
 */
export function calculateTechnique(prCount, commitCount, uniqueLanguagesCount) {
  const prRatio = commitCount > 0 ? prCount / (commitCount + 1) : 0;
  const ratioScore = prRatio * 100; // high percentage of structured commits
  const diversityBonus = uniqueLanguagesCount * 4;
  
  const rawScore = 30 + ratioScore + diversityBonus;
  return clamp(rawScore);
}

/**
 * Calculates Fitness Rating (Activity Consistency)
 * Uses current streak and longest streak
 */
export function calculateFitness(currentStreak, longestStreak) {
  const rawScore = 30 + (currentStreak * 1.5) + (longestStreak * 0.5);
  return clamp(rawScore);
}

/**
 * Calculates Experience Rating (Career duration)
 * Uses years active since profile creation
 */
export function calculateExperience(yearsActive) {
  const rawScore = 30 + (yearsActive * 7);
  return clamp(rawScore);
}

/**
 * Determines a player's role based on their stats
 */
export function determinePlayerRole({
  batting,
  bowling,
  fielding,
  technique,
  experience,
  prReviews,
  issuesClosed,
  orgCount,
  followers,
  stars,
  commitsCount,
  languages
}) {
  // 1. Captain: High experience, org count and followers
  if (orgCount >= 3 && followers >= 150) {
    return 'Captain';
  }

  // 2. Wicket Keeper: High reviews (fielding), low issues
  if (prReviews >= 40 && issuesClosed < 15 && fielding >= 75) {
    return 'Wicket Keeper';
  }

  // 3. All-Rounder: High batting AND bowling ratings
  if (batting >= 65 && bowling >= 65) {
    return 'All Rounder';
  }

  // Compile-heavy language names list
  const systemLanguages = ['rust', 'go', 'cpp', 'c', 'java', 'kotlin', 'swift'];
  const primaryLang = (languages && languages[0]) ? languages[0].toLowerCase() : '';

  // 4. Fast Bowler: Dominant issues closed (wickets) + compiled languages
  if (bowling >= 70 && issuesClosed >= 25 && systemLanguages.includes(primaryLang)) {
    return 'Fast Bowler';
  }

  // 5. Spinner: Dominant issues closed (wickets) + dynamic/interpreted languages
  if (bowling >= 65 && issuesClosed >= 20) {
    return 'Spinner';
  }

  // 6. Aggressive Opener: High stars, low commits (high impact per commit)
  if (batting >= 70 && stars >= 150 && commitsCount < stars * 3) {
    return 'Aggressive Opener';
  }

  // 7. Anchor: High commits, low stars (consistent, long innings)
  if (batting >= 68 && commitsCount >= 500 && stars < 30) {
    return 'Anchor';
  }

  // 8. Finisher: Moderate commits, high PR count, batting/fielding active
  if (batting >= 65 && technique >= 65) {
    return 'Finisher';
  }

  // 9. Middle Order (Fallback Batting)
  if (batting >= bowling) {
    return 'Middle Order';
  }

  // 10. Bowler fallback
  return 'Spinner';
}

/**
 * Calculates Overall Rating (OVR)
 * Runs a weighted average depending on the calculated Player Role
 */
export function calculateOverall(
  batting,
  bowling,
  fielding,
  technique,
  fitness,
  experience,
  playerRole
) {
  let ovr = 30;

  switch (playerRole) {
    case 'Aggressive Opener':
    case 'Anchor':
    case 'Middle Order':
    case 'Finisher':
      // Batting Heavy
      ovr = (0.50 * batting) + (0.20 * technique) + (0.15 * experience) + (0.15 * fitness);
      break;

    case 'Fast Bowler':
    case 'Spinner':
      // Bowling Heavy
      ovr = (0.50 * bowling) + (0.20 * technique) + (0.15 * experience) + (0.15 * fitness);
      break;

    case 'All Rounder':
    case 'Wicket Keeper':
    case 'Captain':
    default:
      // Balanced
      ovr = (0.30 * batting) + (0.30 * bowling) + (0.15 * technique) + (0.15 * fitness) + (0.10 * experience);
      break;
  }

  return clamp(ovr);
}
