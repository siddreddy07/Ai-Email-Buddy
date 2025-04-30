Apologies for the confusion earlier! Here’s the **complete markdown code** for the entire `README.md` file:

```markdown
# Email Summarizer Chrome Extension

This Chrome extension automatically summarizes emails in Gmail using the OpenRouter API, converting URLs into clickable links and providing concise, professional summaries with key points and actionable insights.

## Features

- 📧 Summarizes emails with 3–4 key points and up to 2 extras.
- 🔗 Converts URLs into clickable links.
- 🖼️ Includes image URLs in summaries.
- 🎨 Uses color-coded badges (green, red, yellow, blue) to indicate email status or priority.
- 🔑 Securely stores API keys.
- 🔔 Clears old summaries when a new email is opened.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/email-summarizer-extension.git
   ```
2. Navigate to `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the folder containing the extension files (either `dist` after building, or `src` if you haven’t built yet).
5. The extension will now appear in your Chrome extensions list.

## Usage

1. **Set API Key**:
   - Open the extension popup (click the extension icon).
   - Enter your API key from [OpenRouter](https://openrouter.ai/) and save it.
   
2. **View Summaries**:
   - Open an email in Gmail.
   - The extension will automatically process the email and display a summary with:
     - Subject (1–2 words).
     - Sender name.
     - Summary body with key points (✅) and extras (📌).
     - Badge color indicating status (green, red, yellow, or blue).
   
3. **New Emails**:
   - The extension will detect when you view a new email and clear old summaries to ensure fresh content.

## How It Works

- **Content Extraction**: Scrapes email content, sender details, and image URLs from Gmail’s DOM using specific selectors.
- **API Integration**: Sends email HTML and image URLs to the OpenRouter API for summarization.
- **Summary Formatting**: Returns a concise summary in JSON with subject, body (HTML-formatted with tags like `<p>`, `<ul>`, `<li>`, `<strong>`, `<a>`), and badge color.
- **Storage**: Caches summaries in `chrome.storage.local` to avoid redundant API calls for the same email.
- **Security**: Sanitizes HTML to allow only safe tags and validates URLs for safety.
- **New Email Detection**: Monitors URL changes to detect when a new email is opened and clears cached summaries.

## Build

1. Ensure **Node.js** and **npm** are installed.
2. Navigate to the project folder:
   ```bash
   cd email-summarizer-extension
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Find the built files in the `dist` folder.

### `package.json` Scripts

```json
{
  "scripts": {
    "build": "rm -rf dist && mkdir dist && cp -r src/* dist/"
  }
}
```

## File Structure

```
email-summarizer-extension/
├── src/
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── manifest.json
├── dist/
├── package.json
├── README.md
```

## Configuration

- **manifest.json**:
   - Ensure it includes the required permissions: `storage`, `activeTab`, `https://mail.google.com/*`, `https://openrouter.ai/*`.
   - Configure content script to run on `https://mail.google.com/*`.
   
- **API Setup**:
   - Replace `'https://your-site-url.com'` in `content.js` with your site URL (if needed).
   - Update `'Email Summarizer'` in the `X-Title` header if required.

## Troubleshooting

- **"No API key found"**: Set a valid API key in the extension popup.
- **"Can't find email content"**: Ensure you're viewing an email in Gmail. Update the DOM selectors in `content.js` if Gmail’s structure changes.
- **API failed**: Verify the validity of your OpenRouter API key and check the network or API status.
- **Timeout errors**: Increase the timeout in `content.js` (default is 30 seconds) for slow API responses.
- **Invalid summaries**: Check the API response JSON for missing fields or malformed data. Ensure the API model supports the required prompt structure.

## Limitations

- The extension works only on Gmail (`https://mail.google.com/*`).
- It requires a valid OpenRouter API key.
- The extension may fail if Gmail’s DOM structure changes significantly.
- Image summaries depend on API support for image processing.
- The extension does not handle email attachments directly; it only summarizes linked content.

## License

MIT License. See [LICENSE](LICENSE).

## Resources

- **LinkedIn Learning**: [How to Use LinkedIn Learning](https://www.linkedin.com/learning/how-to-use-linkedin-learning)
```

This is the entire markdown code for your `README.md` file, which includes everything: features, installation, usage, configuration, troubleshooting, build instructions, and limitations. Make sure to replace the `your-username` in the repository URL with your GitHub username.

Let me know if you need any more adjustments or additional details!
