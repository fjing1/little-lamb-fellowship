// Netlify Function to handle prayer requests and save to GitHub Issues
const { Octokit } = require('@octokit/rest');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, request, email } = JSON.parse(event.body);

    // Validate required fields
    if (!request || request.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prayer request is required' })
      };
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Create issue title and body
    const title = `Prayer Request${name ? ` from ${name}` : ''}`;
    const timestamp = new Date().toLocaleString();
    
    let body = `## Prayer Request\n\n`;
    
    if (name && name.trim()) {
      body += `**From:** ${name.trim()}\n`;
    }
    
    if (email && email.trim()) {
      body += `**Contact:** ${email.trim()}\n`;
    }
    
    body += `**Submitted:** ${timestamp}\n\n`;
    body += `**Request:**\n${request.trim()}\n\n`;
    body += `---\n*This prayer request was automatically submitted through the LLF website.*`;

    // Create GitHub issue
    const issue = await octokit.rest.issues.create({
      owner: process.env.GITHUB_OWNER || 'your-username',
      repo: process.env.GITHUB_REPO || 'little-lamb-fellowship',
      title: title,
      body: body,
      labels: ['prayer-request', 'needs-prayer']
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Prayer request submitted successfully',
        issueNumber: issue.data.number
      })
    };

  } catch (error) {
    console.error('Error creating prayer request:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to submit prayer request'
      })
    };
  }
};