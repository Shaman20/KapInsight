import express from 'express';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import cors from 'cors';

const app = express();

// Set up CORS
const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the Lighthouse route
const router = express.Router();

router.post('/lighthouse', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let chrome;
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'html', // Set output to HTML initially
      onlyCategories: ['performance'],
      port: chrome.port,
    };
    const config = {
      extends: 'lighthouse:default',
      settings: {
        onlyAudits: [
          'first-meaningful-paint',
          'speed-index',
          'interactive',
        ],
      },
    };

    // Run Lighthouse for HTML report
    options.output = 'html';
    const runnerResult = await lighthouse(url, options, config);
    const htmlReport = runnerResult.report;
    res.send(htmlReport)    
  } catch (error) {
    console.error('Lighthouse error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to run Lighthouse' });
    }
  } finally {
    if (chrome) {
      try {
        chrome.kill();
      } catch (error) {
        console.error('Error killing Chrome:', error);
      }
    }
  }
});

app.use('/api', router);

// Start the server
const port = process.env.PORT || 6060;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
