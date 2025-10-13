/**
 * GitHub repository data extraction utilities
 * Server-side only - uses fetch to scrape GitHub pages
 */

export interface RepoInfo {
  owner: string
  name: string
  fullName: string
  url: string
  description?: string
  language?: string
  stars?: number
  forks?: number
  lastUpdated?: string
  readme?: string
}

/**
 * Extract basic repo info from GitHub URL
 */
export function parseGitHubUrl(url: string): Pick<RepoInfo, 'owner' | 'name' | 'fullName' | 'url'> | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) return null
  
  const owner = match[1]
  const name = match[2]
  
  return {
    owner,
    name,
    fullName: `${owner}/${name}`,
    url
  }
}

/**
 * Scrape GitHub page for repository information
 * Server-side only function
 */
export async function scrapeGitHubRepo(url: string): Promise<RepoInfo | null> {
  try {
    const basicInfo = parseGitHubUrl(url)
    if (!basicInfo) return null

    // Fetch the GitHub page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`)
      return basicInfo
    }

    const html = await response.text()
    
    // Extract data using regex patterns
    const repoInfo: RepoInfo = { ...basicInfo }

    // Description from meta tag or page
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/) ||
                     html.match(/<span class="[^"]*f4[^"]*" itemprop="about">([^<]*)</)
    if (descMatch) {
      repoInfo.description = descMatch[1].trim()
    }

    // Primary language - more specific patterns to avoid "Explore"
    const langMatch = html.match(/<span[^>]*itemprop="programmingLanguage"[^>]*>([^<]+)</) ||
                     html.match(/aria-label="([A-Za-z+#]+)\s+[\d.]+%[^"]*"/) ||
                     html.match(/<span[^>]*class="[^"]*color-fg-default[^"]*"[^>]*>([A-Za-z+#]+)<\/span>\s*<span[^>]*>[\d.]+%</)
    if (langMatch && langMatch[1] !== 'Explore') {
      repoInfo.language = langMatch[1].trim()
    }

    // Star count - try multiple patterns
    const starMatch = html.match(/(\d+(?:,\d+)*)\s+users starred this repository/) ||
                     html.match(/aria-label="(\d+(?:,\d+)*) users starred this repository"/) ||
                     html.match(/(\d+(?:,\d+)*)\s*<\/strong>\s*<\/span>\s*<\/a>\s*<span[^>]*>Stars</) ||
                     html.match(/id="repo-stars-counter-star"[^>]*>([^<]+)</)
    if (starMatch) {
      repoInfo.stars = parseInt(starMatch[1].replace(/,/g, ''))
    }

    // Fork count - try multiple patterns  
    const forkMatch = html.match(/(\d+(?:,\d+)*)\s+users forked this repository/) ||
                     html.match(/aria-label="(\d+(?:,\d+)*) users forked this repository"/) ||
                     html.match(/(\d+(?:,\d+)*)\s*<\/strong>\s*<\/span>\s*<\/a>\s*<span[^>]*>Forks</) ||
                     html.match(/id="repo-network-counter"[^>]*>([^<]+)</)
    if (forkMatch) {
      repoInfo.forks = parseInt(forkMatch[1].replace(/,/g, ''))
    }

    // Last updated - look for relative time
    const updateMatch = html.match(/<relative-time[^>]*>([^<]*)<\/relative-time>/)
    if (updateMatch) {
      repoInfo.lastUpdated = updateMatch[1].trim()
    }

    return repoInfo
    
  } catch (error) {
    console.error('Error scraping GitHub repo:', error)
    return parseGitHubUrl(url) // Return basic info if scraping fails
  }
}

/**
 * Get README content from GitHub repo
 * Server-side only function
 */
export async function getGitHubReadme(owner: string, name: string): Promise<string | null> {
  try {
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${name}/main/README.md`
    
    let response = await fetch(readmeUrl)
    
    // Try master branch if main doesn't exist
    if (!response.ok) {
      const masterUrl = `https://raw.githubusercontent.com/${owner}/${name}/master/README.md`
      response = await fetch(masterUrl)
    }
    
    if (!response.ok) {
      return null
    }
    
    const readme = await response.text()
    
    // Basic cleanup - remove images and complex markdown
    return readme
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to plain text
      .trim()
      
  } catch (error) {
    console.error('Error fetching README:', error)
    return null
  }
}

/**
 * Get complete repository information including README
 * Server-side only function
 */
export async function getCompleteRepoInfo(url: string): Promise<RepoInfo | null> {
  try {
    const repoInfo = await scrapeGitHubRepo(url)
    if (!repoInfo) return null

    // Get README content
    const readme = await getGitHubReadme(repoInfo.owner, repoInfo.name)
    if (readme) {
      repoInfo.readme = readme
    }

    return repoInfo

  } catch (error) {
    console.error('Error getting complete repo info:', error)
    return null
  }
}

/**
 * Fetch all repositories for a GitHub user
 * Server-side only function
 */
export async function fetchUserRepos(username: string): Promise<string[]> {
  try {
    const profileUrl = `https://github.com/${username}?tab=repositories`

    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`)
    }

    const html = await response.text()

    // Extract repo links
    const repoPattern = new RegExp(`href="/(${username}/[^"]+)"[^>]*itemprop="name codeRepository"`, 'g')
    const matches = [...html.matchAll(repoPattern)]

    const repoUrls = matches
      .map(match => `https://github.com/${match[1]}`)
      .filter((url, index, self) => self.indexOf(url) === index)

    console.log(`Found ${repoUrls.length} repositories for ${username}`)
    return repoUrls
  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error)
    return []
  }
}