// Turn URLs in email text into clickable links
function makeLinksClickable(text) {
  const urlPattern = /(https?:\/\/[\w-]+\.[a-z]{2,}[^\s<>"']*)/gi;
  return text.replace(urlPattern, (url) => {
    let cleanUrl = url;
    if (cleanUrl.endsWith('.') || cleanUrl.endsWith(',')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    try {
      new URL(cleanUrl);
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
    } catch {
      return url;
    }
  });
}

// Wait for an element to appear on the page
function findElement(selector, timeout) {
  const startTime = Date.now();
  function check() {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    if (Date.now() - startTime > timeout) {
      throw new Error(`Couldn't find ${selector}`);
    }
    setTimeout(check, 100);
  }
  return check();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Got message:', message);

  if (!window.location.href.startsWith('https://mail.google.com/')) {
    sendResponse({ status: 'Not on Gmail' });
    return;
  }

  if (message.action === 'setApiKey') {
    console.log('Saving API key');
    chrome.storage.local.set({ apiKey: message.apiKey }, () => {
      console.log('API key saved');
      sendResponse({ status: 'Key saved' });
    });
    return true;
  }

  if (message.action === 'getEmailContent') {
    console.log('Trying to get email content');
    const timeout = setTimeout(() => {
      console.error('Took too long!');
      sendResponse({
        subject: 'Error',
        sender: 'System',
        body: '<p><strong>Error:</strong></p><ul><li>Took too long to process.</li></ul>',
        badgeColor: 'red',
      });
    }, 30000);

    let apiKey = message.apiKey;
    if (apiKey) {
      processEmail(apiKey, sendResponse, timeout);
    } else {
      console.log('Looking for saved API key');
      chrome.storage.local.get(['apiKey'], (result) => {
        apiKey = result.apiKey;
        if (apiKey) {
          console.log('Found API key');
          processEmail(apiKey, sendResponse, timeout);
        } else {
          console.error('No API key found');
          clearTimeout(timeout);
          sendResponse({
            subject: 'Error',
            sender: 'System',
            body: '<p><strong>Error:</strong></p><ul><li>Please set an API key.</li></ul>',
            badgeColor: 'red',
          });
        }
      });
    }
    return true;
  }
});

// Process the email
function processEmail(apiKey, sendResponse, timeout) {
  console.log('Processing email');
  const emailId = getEmailId();
  if (!emailId) {
    console.error('No email ID found');
    clearTimeout(timeout);
    sendResponse({
      subject: 'Error',
      sender: 'System',
      body: '<p><strong>Error:</strong></p><ul><li>Can’t find email ID.</li></ul>',
      badgeColor: 'red',
    });
    return;
  }
  console.log('Email ID:', emailId);

  chrome.storage.local.get(['emailSummaries'], (result) => {
    const summaries = result.emailSummaries || {};
    if (summaries[emailId]) {
      console.log('Found saved summary for email:', emailId);
      clearTimeout(timeout);
      sendResponse(summaries[emailId]);
      return;
    }

    console.log('Looking for email content');
    try {
      const contentEl = findElement('.a3s, .ii.gt, .adn, .message', 5000);
      let senderEl = null;
      try {
        senderEl = findElement('.gD, .go, .from', 2000);
      } catch {
        console.log('No sender found, using default');
      }

      const emailHTML = contentEl.innerHTML.trim() || 'No content';
      const processedHTML = makeLinksClickable(emailHTML);
      const sender = senderEl ? senderEl.getAttribute('email') || senderEl.innerText || 'Unknown Sender' : 'Unknown Sender';

      console.log('Sender:', sender);
      console.log('Email HTML length:', processedHTML.length);

      // Extract image URLs from email
      const imageUrls = [];
      const imgRegex = /<img[^>]+src=["'](.*?)["']/gi;
      let match;
      while ((match = imgRegex.exec(emailHTML)) !== null) {
        const url = match[1];
        if (url.startsWith('http://') || url.startsWith('https://')) {
          imageUrls.push(url);
        }
      }
      console.log('Found images:', imageUrls);

      summarizeEmail(processedHTML, imageUrls, apiKey, (summary) => {
        if (summary.error) {
          console.error('Summary error:', summary.error);
          clearTimeout(timeout);
          sendResponse({
            subject: 'Error',
            sender,
            body: `<p><strong>Error:</strong></p><ul><li>Summary failed: ${summary.error}</li></ul>`,
            badgeColor: 'red',
          });
          return;
        }

        const response = {
          subject: summary.subject,
          sender,
          body: summary.body,
          badgeColor: summary.badgeColor,
        };

        console.log('Saving summary');
        summaries[emailId] = response;
        chrome.storage.local.set({ emailSummaries: summaries }, () => {
          console.log('Summary saved for email:', emailId);
          clearTimeout(timeout);
          sendResponse(response);
        });
      });
    } catch (error) {
      console.error('Error finding email:', error.message);
      clearTimeout(timeout);
      sendResponse({
        subject: 'Error',
        sender: 'System',
        body: `<p><strong>Error:</strong></p><ul><li>Can’t find email content.</li></ul>`,
        badgeColor: 'red',
      });
    }
  });
}

// Get email ID from URL
function getEmailId() {
  const url = window.location.href;
  if (url.includes('#inbox/')) {
    const id = url.split('#inbox/')[1].split('?')[0];
    console.log('Found email ID:', id);
    return id;
  }
  if (url.includes('#sent/')) {
    const id = url.split('#sent/')[1].split('?')[0];
    console.log('Found email ID:', id);
    return id;
  }
  if (url.includes('#label/')) {
    const parts = url.split('/');
    const id = parts[parts.length - 1].split('?')[0];
    console.log('Found email ID:', id);
    return id;
  }
  console.log('No email ID in URL:', url);
  return null;
}

// Call API to summarize email
function summarizeEmail(emailHTML, imageUrls, apiKey, callback) {
  console.log('Calling summary API');
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  const prompt = `
Summarize this email as JSON. Rules:
- "subject": 1-2 words.
- "body": HTML with <p>, <ul>, <li>, <strong>, <a> tags. Use emojis (🙌, ✅, 📌).
  - Crisp, clear proper not just ignoring important details in a short overview-style for quick understanding -- the reciever is reading the summary make it accordingly professional not unwanted things no repetions of same details again and again unnecessary and make preview of attachement and download of the attachment possible the reciever name shouldn't be mentioned as the reciever only reading the summary right keep all those things in mind proeprly .
  - Start with sender name from the email body.
  - 3-4 ✅ bullets for main points.
  - 0-2 📌 bullets for extras.
  - Links: <a href="..." target="_blank" rel="noopener noreferrer">Text</a>.
  - Describe images briefly if provided.
- "badgeColor": "green" (good), "red" (bad), "yellow" (action), "blue" (info).
Email:
${emailHTML.replace(/"/g, '\\"')}
`;

  // Prepare message content
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt,
        },
      ],
    },
  ];

  // Add image URLs if present
  if (imageUrls.length > 0) {
    imageUrls.forEach((url) => {
      messages[0].content.push({
        type: 'image_url',
        image_url: { url },
      });
    });
  }

  // Make API request
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://your-site-url.com', // Replace with your site URL
      'X-Title': 'Email Summarizer', // Replace with your site title
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages,
    }),
  })
    .then((response) => {
      console.log('API response status:', response.status);
      if (!response.ok) {
        throw new Error('API failed with status ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.choices || !data.choices[0].message.content) {
        throw new Error('No summary from API');
      }

      let summaryText = data.choices[0].message.content.trim();
      if (summaryText.startsWith('```json')) {
        summaryText = summaryText.replace(/^```json\n|```$/g, '');
      }

      let summary;
      try {
        summary = JSON.parse(summaryText);
      } catch (error) {
        console.error('Bad JSON:', summaryText);
        throw new Error('Can’t understand API response');
      }

      if (!summary.subject || !summary.body || !summary.badgeColor) {
        throw new Error('Summary missing parts');
      }

      let cleanSubject = summary.subject.split(' ').slice(0, 2).join(' ');
      if (!cleanSubject) {
        cleanSubject = 'No Subject';
      }

      let cleanBody = summary.body || '';
      cleanBody = cleanBody.replace(/<script.*?>.*?<\/script>/gi, '');
      cleanBody = cleanBody.replace(
        /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi,
        (match, href, text) => {
          if (href.startsWith('http://') || href.startsWith('https://')) {
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
          }
          return text;
        }
      );
      const safeTags = ['p', 'ul', 'li', 'strong', 'a'];
      cleanBody = cleanBody.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name) => {
        if (safeTags.includes(name.toLowerCase())) {
          return tag;
        }
        return '';
      });

      const validColors = ['green', 'red', 'yellow', 'blue'];
      let badgeColor = summary.badgeColor.toLowerCase();
      if (!validColors.includes(badgeColor)) {
        badgeColor = 'blue';
      }

      console.log('Summary created');
      callback({
        subject: cleanSubject,
        body: cleanBody || '<p>🙌 <strong>No Summary:</strong></p><ul><li>✅ Nothing to show.</li></ul>',
        badgeColor: badgeColor,
      });
    })
    .catch((error) => {
      console.error('API error:', error.message);
      callback({ error: error.message });
    });
}

// Watch for new emails
function watchForNewEmail() {
  let lastEmailId = getEmailId();
  setInterval(() => {
    const currentEmailId = getEmailId();
    if (currentEmailId && currentEmailId !== lastEmailId) {
      console.log('New email, clearing summaries');
      chrome.storage.local.set({ emailSummaries: {} }, () => {
        console.log('Summaries cleared');
      });
      lastEmailId = currentEmailId;
    }
  }, 2000);
}

// Start watching for new emails
watchForNewEmail();