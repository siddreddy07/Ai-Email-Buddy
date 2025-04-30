
import React, { useState, useEffect, createContext, useContext } from 'react';

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Toggle Button Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full shadow-md transition-all duration-300 ${
        theme === 'light'
          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

// Email Section Component
const EmailSection = ({ title, content, isBody = false }) => {
  const { theme } = useContext(ThemeContext);

  const handleCopy = (title,content)=>{
      if(title == 'Sender'){
        navigator.clipboard.writeText(content)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy:', err));
      }
  }

  return (
    <div onClick={()=>{handleCopy(title,content)}}
      className={`p-4 rounded-xl ${title === 'Sender' ? 'cursor-pointer' : ''} border transition-all duration-300 relative ${
        theme === 'light'
          ? 'bg-white border-gray-200 hover:shadow-md'
          : 'bg-gray-800 border-gray-700/30 hover:bg-gray-750 hover:shadow-md'
      }`}
    >
      <h3
        className={`text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
          theme === 'light'
            ? 'text-gray-800 hover:text-indigo-500'
            : '!text-white hover:text-indigo-200'
        }`}
      >
        {title}
      </h3>
      <div
        className={`email-content mt-1 text-xs sm:text-sm break-words ${
          isBody ? 'max-h-36 overflow-y-auto scrollbar-thin pr-2 sm:pr-3' : ''
        } ${
          theme === 'light'
            ? 'text-gray-600 [&_a]:underline [&_a]:text-indigo-600 [&_a:hover]:text-indigo-800'
            : '!text-white [&_*]:!text-white [&_strong]:text-inherit [&_a]:underline [&_a]:text-indigo-300 [&_a:hover]:text-indigo-100'
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

// Grab Button Component
const GrabButton = ({ loading, onClick, retryCount }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-2.5 sm:py-3 rounded-xl text-white font-medium text-sm sm:text-base shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        theme === 'light'
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50 disabled:bg-indigo-300'
          : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-400/50 disabled:bg-indigo-500'
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="animate-pulse">
            {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Grabbing...'}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span>Grab Email</span>
        </div>
      )}
    </button>
  );
};

// Clear Cache Button Component
const ClearCacheButton = ({ onClick }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <button
      onClick={onClick}
      className={`w-full py-2.5 sm:py-3 rounded-xl text-white font-medium text-sm sm:text-base shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        theme === 'light'
          ? 'bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500/50'
          : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400/50'
      }`}
    >
      Clear Cache
    </button>
  );
};

// App Component
const App = () => {
  const [emailText, setEmailText] = useState({
    subject: '',
    sender: '',
    body: '',
    badgeColor: '',
  });
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { theme } = useContext(ThemeContext);

  // Load API key and check for cached summary on mount
  useEffect(() => {
    chrome.storage.local.get(['openRouterApiKey', 'emailSummaries'], (result) => {
      if (result.openRouterApiKey) {
        setApiKey(result.openRouterApiKey);
        console.log('Loaded API key from storage:', result.openRouterApiKey);
      }
      // Check for cached summary based on active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const emailId = getEmailIdFromUrl(tabs[0].url);
          const summaries = result.emailSummaries || {};
          if (emailId && summaries[emailId]) {
            setEmailText({
              subject: summaries[emailId].subject,
              sender: summaries[emailId].sender,
              body: summaries[emailId].body,
              badgeColor: summaries[emailId].badgeColor,
            });
            console.log('Loaded cached summary for email:', emailId);
          }
        }
      });
    });

    // Monitor tab updates and storage changes
    const handleTabUpdate = (tabId, changeInfo, tab) => {
      if (changeInfo.url && tab.active && tab.url.startsWith('https://mail.google.com/')) {
        const newEmailId = getEmailIdFromUrl(tab.url);
        chrome.storage.local.get(['emailSummaries'], (result) => {
          const summaries = result.emailSummaries || {};
          if (newEmailId && summaries[newEmailId]) {
            setEmailText({
              subject: summaries[newEmailId].subject,
              sender: summaries[newEmailId].sender,
              body: summaries[newEmailId].body,
              badgeColor: summaries[newEmailId].badgeColor,
            });
          } else {
            setEmailText({
              subject: '',
              sender: '',
              body: '',
              badgeColor: '',
            });
          }
        });
      }
    };

    const handleStorageChange = (changes, area) => {
      if (area === 'local' && changes.emailSummaries) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.url) {
            const emailId = getEmailIdFromUrl(tabs[0].url);
            const summaries = changes.emailSummaries.newValue || {};
            if (emailId && summaries[emailId]) {
              setEmailText({
                subject: summaries[emailId].subject,
                sender: summaries[emailId].sender,
                body: summaries[emailId].body,
                badgeColor: summaries[emailId].badgeColor,
              });
            }
          }
        });
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Extract email ID from URL
  const getEmailIdFromUrl = (url) => {
    const match = url.match(/#inbox\/([^?]+)/) || url.match(/#sent\/([^?]+)/) || url.match(/#[\w]+\/([^?]+)/);
    return match ? match[1] : null;
  };

  // Save API key
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      const newApiKey = apiKeyInput.trim();
      chrome.storage.local.set({ openRouterApiKey: newApiKey }, () => {
        setApiKey(newApiKey);
        setApiKeyInput('');
        console.log('Saved API key:', newApiKey);
        chrome.runtime.sendMessage(
          { action: 'setApiKey', apiKey: newApiKey },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending API key:', chrome.runtime.lastError);
            } else {
              console.log('API key sent to content script:', response);
            }
          }
        );
      });
    } else {
      alert('Please enter a valid API key.');
    }
  };

  // Clear cache (only email summaries, preserve openRouterApiKey)
  const clearCache = () => {
    chrome.storage.local.remove(['emailSummaries'], () => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing cache:', chrome.runtime.lastError);
        alert('Failed to clear cache. Please try again.');
        return;
      }
      setEmailText({ subject: '', sender: '', body: '', badgeColor: '' });
      console.log('Cleared emailSummaries from storage');
      alert('Cache cleared successfully.');
    });
  };

  // Retryable grab email function
  const grabEmail = (attempt = 1, maxRetries = 3, retryDelay = 2000) => {
    setLoading(true);
    setRetryCount(attempt - 1);
    console.log(`Grabbing email (Attempt ${attempt}/${maxRetries}) with API key:`, apiKey);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].url.startsWith('https://mail.google.com/')) {
        console.error('No valid Gmail tab found');
        setEmailText({
          subject: 'Error',
          sender: 'No Sender',
          body: `<p><strong>Error:</strong></p><ul><li>No valid Gmail tab found (Attempt ${attempt}/${maxRetries}).</li></ul>`,
          badgeColor: 'red',
        });
        setLoading(false);
        setRetryCount(0);
        return;
      }

      const emailId = getEmailIdFromUrl(tabs[0].url);
      if (!emailId) {
        console.error('Invalid email ID');
        setEmailText({
          subject: 'Error',
          sender: 'No Sender',
          body: `<p><strong>Error:</strong></p><ul><li>Invalid email ID (Attempt ${attempt}/${maxRetries}).</li></ul>`,
          badgeColor: 'red',
        });
        setLoading(false);
        setRetryCount(0);
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getEmailContent', apiKey },
        (response) => {
          if (chrome.runtime.lastError || !response || response.subject === 'Error') {
            const errorMsg = chrome.runtime.lastError?.message || response?.body || 'Unknown error';
            console.error(`Error grabbing email: ${errorMsg}`);
            if (attempt < maxRetries) {
              console.log(`Retrying in ${retryDelay}ms...`);
              setTimeout(() => grabEmail(attempt + 1, maxRetries, retryDelay), retryDelay);
              return;
            }
            // Max retries reached
            setEmailText({
              subject: 'Error',
              sender: 'No Sender',
              body: `<p><strong>Error:</strong></p><ul><li>Failed to grab email after ${maxRetries} attempts: ${errorMsg}.</li></ul>`,
              badgeColor: 'red',
            });
            setLoading(false);
            setRetryCount(0);
            return;
          }

          // Successful fetch, save to storage
          console.log('Received response from content script:', response);
          const emailData = {
            subject: response.subject || 'No Subject',
            sender: response.sender || 'No Sender',
            body: response.body || '<p><strong>No Summary:</strong></p><ul><li>No content available.</li></ul>',
            badgeColor: response.badgeColor || 'blue',
          };
          setEmailText(emailData);

          // Save successful summary to storage
          chrome.storage.local.get(['emailSummaries'], (result) => {
            const summaries = result.emailSummaries || {};
            summaries[emailId] = emailData;
            chrome.storage.local.set({ emailSummaries: summaries }, () => {
              console.log('Saved email summary for email:', emailId);
            });
          });

          setLoading(false);
          setRetryCount(0);
        }
      );
    });
  };

  const handleGrabEmail = () => {
    if (!apiKey) {
      alert('Please enter a valid API key first.');
      return;
    }
    grabEmail(1); // Start with attempt 1
  };

  // Badge Color Class for Subject
  const badgeColorClass = {
    green: `font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-500'}`,
    red: `font-bold ${theme === 'light' ? 'text-red-600' : 'text-red-500'}`,
    yellow: `font-bold ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`,
    blue: `font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`,
  }[emailText.badgeColor] || `font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`;

  return (
    <div
      className={`w-96 max-w-96 mx-auto flex items-center justify-center p-4 sm:p-5 h-[500px] transition-all duration-500 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-gray-50 to-indigo-100'
          : 'bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950'
      }`}
    >
      <div
        className={`w-full rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-500 max-h-[90vh] overflow-y-auto scrollbar-thin ${
          theme === 'light' ? 'bg-white shadow-gray-200' : 'bg-gray-900/90 backdrop-blur-md border-gray-700/50'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-base sm:text-lg font-extrabold tracking-wide ${
              theme === 'light'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-600'
                : 'text-white shadow-sm'
            }`}
          >
            Email Buddy 👓
          </h2>
          <ThemeToggle />
        </div>
        {!apiKey ? (
          <div className="mb-4 space-y-3">
            <input
              type="text"
              placeholder="Enter OpenRouter API Key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className={`w-full p-2 rounded-lg border text-sm shadow-inner ${
                theme === 'light'
                  ? 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'
                  : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <button
              onClick={handleSaveApiKey}
              className={`w-full py-2 rounded-lg text-white font-medium text-sm shadow-md transition-all duration-300 hover:shadow-lg ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500/50'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:ring-2 focus:ring-indigo-400/50'
              }`}
            >
              Save API Key
            </button>
          </div>
        ) : (
          <div className="flex flex-col min-h-[calc(90vh-8rem)]">
            <div className="space-y-3 flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <EmailSection
                  title="Subject"
                  content={`<span class="${badgeColorClass}">${emailText.subject}</span>`}
                />
                <EmailSection title="Sender" content={emailText.sender} />
              </div>
              <EmailSection title="Body" content={emailText.body} isBody />
            </div>
            <div className="mt-3 space-y-3">
              <GrabButton loading={loading} onClick={handleGrabEmail} retryCount={retryCount} />
              <ClearCacheButton onClick={clearCache} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap App with ThemeProvider
const Root = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default Root;
