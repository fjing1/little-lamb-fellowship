// Client-side GitHub API integration for prayer requests
class GitHubPrayerStorage {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.apiBase = 'https://api.github.com';
    this.filePath = 'data/prayer-requests.json';
  }

  async submitPrayerRequest(name, request, email) {
    try {
      // First, get the current file to get its SHA
      const currentFile = await this.getCurrentFile();
      
      // Parse existing requests or create empty array
      let requests = [];
      if (currentFile.content) {
        const decoded = atob(currentFile.content);
        requests = JSON.parse(decoded);
      }

      // Add new request
      const newRequest = {
        id: Date.now(),
        name: name || 'Anonymous',
        request: request,
        email: email || null,
        timestamp: new Date().toISOString(),
        status: 'new'
      };
      
      requests.unshift(newRequest); // Add to beginning

      // Keep only last 100 requests to avoid file getting too large
      if (requests.length > 100) {
        requests = requests.slice(0, 100);
      }

      // Update the file
      const result = await this.updateFile(JSON.stringify(requests, null, 2), currentFile.sha);
      
      return {
        success: true,
        message: 'Prayer request saved successfully',
        requestId: newRequest.id
      };

    } catch (error) {
      console.error('Failed to save prayer request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCurrentFile() {
    try {
      const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        // File doesn't exist yet
        return { content: null, sha: null };
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('404')) {
        return { content: null, sha: null };
      }
      throw error;
    }
  }

  async updateFile(content, sha) {
    const body = {
      message: `Add prayer request - ${new Date().toLocaleDateString()}`,
      content: btoa(content), // Base64 encode
      branch: 'main'
    };

    if (sha) {
      body.sha = sha; // Required for updates
    }

    const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${response.status} - ${error.message}`);
    }

    return await response.json();
  }

  // Method to create GitHub Issue as well (optional)
  async createIssue(name, request, email) {
    const title = `Prayer Request${name ? ` from ${name}` : ''}`;
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

    try {
      const response = await fetch(`${this.apiBase}/repos/${this.owner}/${this.repo}/issues`, {
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
      console.error('Failed to create issue:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.GitHubPrayerStorage = GitHubPrayerStorage;
}