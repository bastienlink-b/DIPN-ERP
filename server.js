const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));
app.use(express.json());

// Middleware to check for Notion API key
const checkNotionApiKey = (req, res, next) => {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Notion API key not configured. Please add NOTION_API_KEY to your .env file.' 
    });
  }
  next();
};

// Initialize Notion client
let notionClient = null;

const initNotionClient = () => {
  const apiKey = process.env.NOTION_API_KEY;
  if (apiKey) {
    notionClient = new Client({ auth: apiKey });
    console.log('Notion client initialized with key:', apiKey.substring(0, 7) + '...');
  } else {
    console.warn('No Notion API key found in environment variables');
  }
};

// Initialize Notion client on startup if API key is available
initNotionClient();

// Route to check connection status
app.get('/api/notion/status', async (req, res) => {
  try {
    if (!notionClient) {
      initNotionClient();
      if (!notionClient) {
        return res.status(500).json({ 
          status: 'error',
          message: 'Notion client not initialized. Check your API key.',
          hasApiKey: process.env.NOTION_API_KEY ? true : false
        });
      }
    }
    
    // Try to list users to verify the connection
    const response = await notionClient.users.list({});
    res.json({ 
      status: 'connected',
      message: 'Successfully connected to Notion API',
      hasApiKey: true
    });
  } catch (error) {
    console.error('Error connecting to Notion:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect to Notion API',
      error: error.message,
      hasApiKey: process.env.NOTION_API_KEY ? true : false
    });
  }
});

// NEW ENDPOINT: Route to validate API key
app.post('/api/notion/validate', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ 
        valid: false,
        error: 'API key is required' 
      });
    }
    
    // Create a temporary Notion client with the provided API key
    const tempClient = new Client({ auth: apiKey });
    
    // Try to list users to verify the API key is valid
    const response = await tempClient.users.list({});
    
    res.json({ 
      valid: true,
      message: 'API key is valid'
    });
    
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(400).json({ 
      valid: false,
      error: error.message || 'Failed to validate Notion API key'
    });
  }
});

// Route to query a database
app.post('/api/notion/database/:databaseId/query', checkNotionApiKey, async (req, res) => {
  try {
    const { databaseId } = req.params;
    const { filter, sorts } = req.body;
    
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: filter,
      sorts: sorts
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to query Notion database',
      error: error.message
    });
  }
});

// Route to get database
app.get('/api/notion/database/:databaseId', checkNotionApiKey, async (req, res) => {
  try {
    const { databaseId } = req.params;
    
    const response = await notionClient.databases.retrieve({
      database_id: databaseId
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error retrieving database:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to retrieve Notion database',
      error: error.message
    });
  }
});

// Route to create a page
app.post('/api/notion/pages', checkNotionApiKey, async (req, res) => {
  try {
    const { parent, properties, children } = req.body;
    
    const response = await notionClient.pages.create({
      parent,
      properties,
      children
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to create Notion page',
      error: error.message
    });
  }
});

// Route to update a page
app.patch('/api/notion/pages/:pageId', checkNotionApiKey, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { properties } = req.body;
    
    const response = await notionClient.pages.update({
      page_id: pageId,
      properties
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to update Notion page',
      error: error.message
    });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Notion proxy server is running',
    hasApiKey: process.env.NOTION_API_KEY ? true : false 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Notion proxy server running on port ${PORT}`);
  console.log(`API Status endpoint: http://localhost:${PORT}/api/notion/status`);
  
  // Log API key status
  if (process.env.NOTION_API_KEY) {
    console.log(`Using Notion API key: ${process.env.NOTION_API_KEY.substring(0, 7)}...`);
  } else {
    console.warn('No Notion API key found in environment variables');
  }
});