import { Client } from '@notionhq/client';

// Singleton instance of Notion client
let notionClient: Client | null = null;

// Initialize Notion client with the API key from environment
const getNotionClient = (): Client => {
  if (!notionClient) {
    // Use the API key directly from the environment when in development
    // In production, you might want to handle this differently for security
    const apiKey = import.meta.env.VITE_NOTION_API_KEY || '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';
    
    if (!apiKey) {
      throw new Error('Notion API key is not defined');
    }
    
    notionClient = new Client({ auth: apiKey });
    console.log('Notion client initialized with key:', apiKey.substring(0, 7) + '...');
  }
  
  return notionClient;
};

// Test the connection to Notion API
export const testConnection = async (): Promise<{ isConnected: boolean; error?: string }> => {
  try {
    // Using the worker proxy to avoid CORS issues
    const response = await fetch('/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        apiKey: import.meta.env.VITE_NOTION_API_KEY || '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' 
      })
    });
    
    // Check if the response is OK before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from server:', errorText);
      throw new Error(`Server responded with status ${response.status}: ${errorText || 'No response body'}`);
    }
    
    // Check if response contains content before parsing
    const responseText = await response.text();
    if (!responseText.trim()) {
      throw new Error('Empty response from server');
    }
    
    // Parse the JSON from the text response
    const data = JSON.parse(responseText);
    
    if (!data.valid) {
      throw new Error(data.error || 'Failed to connect to Notion API');
    }
    
    return { isConnected: true };
  } catch (error) {
    console.error('Error connecting to Notion API:', error);
    return { 
      isConnected: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Query a database
export const queryDatabase = async (
  databaseId: string, 
  filter?: any, 
  sorts?: any[]
) => {
  try {
    const client = getNotionClient();
    const response = await client.databases.query({
      database_id: databaseId,
      filter,
      sorts
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error querying database:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Get database details
export const getDatabase = async (databaseId: string) => {
  try {
    const client = getNotionClient();
    const response = await client.databases.retrieve({
      database_id: databaseId
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error retrieving database:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Create a page in a database
export const createPage = async (data: {
  parent: { database_id: string } | { page_id: string };
  properties: any;
  children?: any[];
}) => {
  try {
    const client = getNotionClient();
    const response = await client.pages.create(data);
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error creating page:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Update a page
export const updatePage = async (pageId: string, properties: any) => {
  try {
    const client = getNotionClient();
    const response = await client.pages.update({
      page_id: pageId,
      properties
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error updating page:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};