import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware - Important: Allow requests from the Vite dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Notion API configuration
const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';
const NOTION_API_VERSION = '2022-06-28';

// Root route for health check
app.get('/', (req, res) => {
  res.send('Notion API Proxy Server is running');
});

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test connection endpoint
app.get('/api/notion/test', async (req, res) => {
  try {
    console.log('Testing Notion connection');
    
    const response = await axios.get(`${NOTION_API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
      }
    });
    
    console.log('Connection successful');
    res.json({ isConnected: true, user: response.data });
  } catch (error) {
    console.error('Connection error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      isConnected: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Test database connection endpoint
app.get('/api/notion/database/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Testing connection to database: ${id}`);
    
    const response = await axios.get(`${NOTION_API_URL}/databases/${id}`, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
      }
    });
    
    console.log('Database connection successful');
    res.json({
      isConnected: true,
      name: response.data.title?.[0]?.plain_text || 'Database',
      data: response.data
    });
  } catch (error) {
    console.error('Database connection error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      isConnected: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Query database endpoint
app.post('/api/notion/database/:id/query', async (req, res) => {
  try {
    const { id } = req.params;
    const { filter, sorts } = req.body;
    
    console.log(`Querying database: ${id}`);
    console.log('Filter:', filter);
    console.log('Sorts:', sorts);
    
    const response = await axios.post(`${NOTION_API_URL}/databases/${id}/query`, {
      filter,
      sorts,
    }, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Query successful');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Query error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Create page endpoint
app.post('/api/notion/pages', async (req, res) => {
  try {
    console.log('Creating page');
    console.log('Data:', req.body);
    
    const response = await axios.post(`${NOTION_API_URL}/pages`, req.body, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Page created successfully');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Create page error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Update page endpoint
app.patch('/api/notion/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating page: ${id}`);
    console.log('Data:', req.body);
    
    const response = await axios.patch(`${NOTION_API_URL}/pages/${id}`, req.body, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Page updated successfully');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Update page error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Archive page endpoint
app.patch('/api/notion/pages/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Archiving page: ${id}`);
    
    const response = await axios.patch(`${NOTION_API_URL}/pages/${id}`, {
      archived: true
    }, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Page archived successfully');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Archive page error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Notion API proxy available at http://localhost:${PORT}/api/notion`);
  console.log(`❗ IMPORTANT: Access your React app at http://localhost:5173, NOT port ${PORT}`);
});