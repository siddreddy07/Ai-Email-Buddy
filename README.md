```markdown
# Email Summarizer Chrome Extension

This Chrome extension summarizes Gmail emails using the OpenRouter API, turning URLs into clickable links and creating concise summaries. It uses **React Icons** for UI and **Tailwind CSS** for styling.

## Features

- 📧 Summarizes emails (3–4 key points, up to 2 extras).
- 🔗 Makes URLs clickable.
- 🖼️ Adds image URLs to summaries.
- 🎨 Shows status with colored badges (green, red, yellow, blue).
- 🔑 Securely stores API keys.
- 🔔 Refreshes summaries for new emails.

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/Ai-Email-Buddy.git
   ```
2. Open Chrome, go to `chrome://extensions/`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**, select `dist` (after building) or `src` folder.
5. The extension appears in Chrome.

## Usage

1. **Set API Key**:
   - Click the extension icon.
   - Enter your [OpenRouter](https://openrouter.ai/) API key and save.
2. **View Summaries**:
   - Open a Gmail email.
   - See subject, sender, key points (✅), extras (📌), and badge color.
3. **New Emails**:
   - Summaries auto-refresh for new emails.

## Build

1. Install **Node.js** and **npm**.
2. Go to project folder:
   ```bash
   cd Ai-Email-Buddy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build:
   ```bash
   npm run build
   ```
5. Built files are in `dist`.


## File Structure

```
Ai-Email-Buddy/
├── src/
│   ├── public/
│   │   ├── content.js     # Email processing
│   │   ├── manifest.json  # Extension config
│   ├── popup/
│   │   ├── popup.jsx      # Popup UI (React Icons, Tailwind)
│   ├── styles.css         # Tailwind styles
├── dist/                  # Built files
├── package.json
├── tailwind.config.js
├── README.md
```

## Troubleshooting

- **No API key**: Add key in popup.
- **No email content**: Check Gmail; update `content.js` selectors.
- **API errors**: Verify OpenRouter key, network.
- **Build fails**: Ensure Node.js, npm, `src` files exist.
- **Styling issues**: Check Tailwind setup, `styles.css` link.

## Limitations

- Gmail only.
- Needs OpenRouter API key.
- May break if Gmail’s layout changes.
- Image summaries rely on API.
- No attachment support.

## Tutorial

- Learn how to use this extension: [How to Use Extension](https://www.linkedin.com/learning/how-to-use-linkedin-learning)

## License

MIT License. See [LICENSE](LICENSE).
```

### Notes
- **Clean & Simple**: Steps are short, clear, and easy to follow, with minimal technical jargon.
- **File Structure**: Reflects `public` inside `src` with only `content.js` and `manifest.json`, and `popup` folder inside `src` with `popup.jsx`.
- **React Icons & Tailwind CSS**: Included for `popup.jsx`, with basic setup instructions.
- **Build**: Copies `src` (including `public` and `popup`) to `dist`. Note: Chrome doesn't support `.jsx` directly; you likely need a bundler (e.g., Webpack) to compile `popup.jsx` to `popup.js`. If you use one, let me know to update the build script.
- **Tutorial**: Only the LinkedIn Learning link is included.
- **Placeholders**: Replace `your-username` with your GitHub username.
- **LICENSE**: Ensure a `LICENSE` file is in your repository.

Copy this code into your `README.md` file, commit, and push to GitHub. If you need other files (e.g., `manifest.json`, `popup.jsx`) or changes (e.g., bundler setup), let me know!
