// GitHub Issues API Prayer Request Handler
// This script can save prayer requests as GitHub Issues

class PrayerRequestHandler {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues`;
  }

  async submitPrayerRequest(name, request, email) {
    const title = `Prayer Request${name ? ` from ${name}` : ''}`;
    const body = this.formatPrayerRequest(name, request, email);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          body: body,
          labels: ['prayer-request', 'needs-prayer']
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const issue = await response.json();
      return {
        success: true,
        issueNumber: issue.number,
        url: issue.html_url
      };
    } catch (error) {
      console.error('Failed to create prayer request issue:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  formatPrayerRequest(name, request, email) {
    const timestamp = new Date().toLocaleString();
    let body = `## Prayer Request\n\n`;
    
    if (name) {
      body += `**From:** ${name}\n`;
    }
    
    if (email) {
      body += `**Contact:** ${email}\n`;
    }
    
    body += `**Submitted:** ${timestamp}\n\n`;
    body += `**Request:**\n${request}\n\n`;
    body += `---\n*This prayer request was automatically submitted through the LLF website.*`;
    
    return body;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrayerRequestHandler;
}