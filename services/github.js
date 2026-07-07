/**
 * Service to interact with the GitHub GraphQL API.
 */
export async function fetchGitHubUserData(username, oauthToken = null) {
  // Use the provided OAuth token or fall back to the server-side GITHUB_TOKEN
  const token = oauthToken || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;

  if (!token) {
    throw new Error('GitHub API token is not configured. Please add GITHUB_TOKEN or GITHUB_PAT to your environment variables.');
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        id
        databaseId
        login
        name
        avatarUrl
        bio
        location
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        organizations(first: 10) {
          totalCount
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'GitCric-Application'
    },
    body: JSON.stringify({
      query,
      variables: { username }
    }),
    next: { revalidate: 0 } // Bypass Next.js fetch cache for fresh data scans
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`GitHub API returned status ${response.status}: ${body.message || response.statusText}`);
  }

  if (body.errors) {
    const isNotFound = body.errors.some(err => err.type === 'NOT_FOUND');
    if (isNotFound) {
      throw new Error(`User "${username}" not found on GitHub.`);
    }
    throw new Error(`GitHub GraphQL Error: ${body.errors.map(e => e.message).join(', ')}`);
  }

  if (!body.data || !body.data.user) {
    throw new Error(`GitHub returned empty payload for user "${username}".`);
  }

  return body.data.user;
}
