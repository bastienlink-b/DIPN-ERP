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

// n8n API configuration
const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

// Root route for health check with redirect to React app
app.get('/', (req, res) => {
  // Redirect users to the React app instead of showing the text message
  res.redirect('http://localhost:5173');
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

// ===================== n8n API Routes =====================

// Get all workflows
app.get('/api/n8n/workflows', async (req, res) => {
  try {
    console.log('Fetching n8n workflows');
    
    const response = await axios.get(`${N8N_API_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      }
    });
    
    console.log('Successfully fetched workflows');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching workflows:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Get a specific workflow
app.get('/api/n8n/workflows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching workflow: ${id}`);
    
    const response = await axios.get(`${N8N_API_URL}/workflows/${id}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      }
    });
    
    console.log('Successfully fetched workflow');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(`Error fetching workflow ${req.params.id}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Execute a workflow
app.post('/api/n8n/workflows/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    
    console.log(`Executing workflow: ${id}`);
    console.log('Data:', data);
    
    const response = await axios.post(`${N8N_API_URL}/workflows/${id}/execute`, {
      data
    }, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Workflow executed successfully');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(`Error executing workflow ${req.params.id}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Get workflow executions
app.get('/api/n8n/executions', async (req, res) => {
  try {
    const { workflowId } = req.query;
    
    console.log(`Fetching executions${workflowId ? ` for workflow: ${workflowId}` : ''}`);
    
    const url = workflowId 
      ? `${N8N_API_URL}/executions?workflowId=${workflowId}`
      : `${N8N_API_URL}/executions`;
    
    const response = await axios.get(url, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      }
    });
    
    console.log('Successfully fetched executions');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching executions:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Get a specific execution
app.get('/api/n8n/executions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching execution: ${id}`);
    
    const response = await axios.get(`${N8N_API_URL}/executions/${id}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      }
    });
    
    console.log('Successfully fetched execution');
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(`Error fetching execution ${req.params.id}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Sync ERP data from n8n workflow
app.post('/api/n8n/sync', async (req, res) => {
  try {
    const { workflowId, entityType } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({
        success: false,
        error: 'workflowId est requis'
      });
    }
    
    if (!entityType) {
      return res.status(400).json({
        success: false,
        error: 'entityType est requis'
      });
    }
    
    console.log(`Synchronisation des données pour ${entityType} depuis le workflow ${workflowId}`);
    
    // 1. Exécuter le workflow pour obtenir les données les plus récentes
    const workflowResponse = await axios.post(`${N8N_API_URL}/workflows/${workflowId}/execute`, {}, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
      }
    });
    
    const executionId = workflowResponse.data.executionId;
    
    // 2. Attendre que l'exécution soit terminée (simple polling)
    let executionCompleted = false;
    let executionData = null;
    let retries = 0;
    const maxRetries = 10;
    
    while (!executionCompleted && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
      
      const executionResponse = await axios.get(`${N8N_API_URL}/executions/${executionId}`, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
        }
      });
      
      if (executionResponse.data.status === 'success' || executionResponse.data.status === 'error') {
        executionCompleted = true;
        executionData = executionResponse.data;
      }
      
      retries++;
    }
    
    if (!executionCompleted) {
      return res.status(500).json({
        success: false,
        error: 'Timeout lors de l\'exécution du workflow'
      });
    }
    
    if (executionData.status === 'error') {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'exécution du workflow',
        details: executionData.error
      });
    }
    
    // 3. Mettre à jour les données ERP en fonction du type d'entité
    // Dans une implémentation réelle, on mettrait à jour les données dans Notion ou une autre base de données
    const outputData = executionData.data.resultData.runData;
    
    console.log(`Données récupérées avec succès pour ${entityType}`);
    
    // Exemple simplifié : on renvoie simplement les données
    res.json({
      success: true,
      message: `Synchronisation réussie pour ${entityType}`,
      data: outputData
    });
    
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error.response?.data || error.message);
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
  console.log(`n8n API proxy available at http://localhost:${PORT}/api/n8n`);
  console.log(`❗ IMPORTANT: Access your React app at http://localhost:5173, NOT port ${PORT}`);
});