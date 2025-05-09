import { Client } from '@notionhq/client';

// Database IDs
const DATABASES = {
  products: '1ebc089bcd7480a7aaa5eb312d8dc239',
  contacts: '1ebc089bcd74805c9e2ffe5cc26928ac',
  logistics: '1ebc089bcd7480b4968be200f75be18b',
  production: '1ebc089bcd7480ecb3d7d070d9a774f6',
  orders: '1ebc089bcd748089a94bfd8925ab6efd'
};

// API version
const NOTION_API_VERSION = '2022-06-28';

// Singleton instance of Notion client
let notionClient: Client | null = null;

// Initialize Notion client with the API key from environment
const getNotionClient = (): Client => {
  if (!notionClient) {
    const apiKey = import.meta.env.VITE_NOTION_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('Notion API key is not defined');
    }
    
    notionClient = new Client({ 
      auth: apiKey,
      notionVersion: NOTION_API_VERSION
    });
    console.log('Notion client initialized');
  }
  
  return notionClient;
};

// Test the connection to Notion API
export const testConnection = async (): Promise<{ isConnected: boolean; error?: string }> => {
  try {
    const client = getNotionClient();
    // Test the connection by listing users
    const response = await client.users.list({});
    
    return { isConnected: true };
  } catch (error) {
    console.error('Error connecting to Notion API:', error);
    return { 
      isConnected: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Test connection to a specific database
export const testDatabaseConnection = async (databaseId: string): Promise<{ 
  isConnected: boolean; 
  error?: string;
  name?: string;
}> => {
  try {
    const client = getNotionClient();
    const response = await client.databases.retrieve({
      database_id: databaseId
    });
    
    return { 
      isConnected: true,
      name: response.title?.[0]?.plain_text || 'Database'
    };
  } catch (error) {
    console.error(`Error connecting to database ${databaseId}:`, error);
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

// Delete a page (archive it)
export const archivePage = async (pageId: string) => {
  try {
    const client = getNotionClient();
    const response = await client.pages.update({
      page_id: pageId,
      archived: true
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error archiving page:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// ================== Database-specific functions ==================

// Products database functions
export const getProducts = async (filter?: any, sorts?: any[]) => {
  return await queryDatabase(DATABASES.products, filter, sorts);
};

export const createProduct = async (properties: any, children?: any[]) => {
  return await createPage({
    parent: { database_id: DATABASES.products },
    properties,
    children
  });
};

// Contacts database functions
export const getContacts = async (filter?: any, sorts?: any[]) => {
  return await queryDatabase(DATABASES.contacts, filter, sorts);
};

export const createContact = async (properties: any, children?: any[]) => {
  return await createPage({
    parent: { database_id: DATABASES.contacts },
    properties,
    children
  });
};

// Logistics database functions
export const getLogistics = async (filter?: any, sorts?: any[]) => {
  return await queryDatabase(DATABASES.logistics, filter, sorts);
};

export const createLogisticsEntry = async (properties: any, children?: any[]) => {
  return await createPage({
    parent: { database_id: DATABASES.logistics },
    properties,
    children
  });
};

// Production database functions
export const getProduction = async (filter?: any, sorts?: any[]) => {
  return await queryDatabase(DATABASES.production, filter, sorts);
};

export const createProductionEntry = async (properties: any, children?: any[]) => {
  return await createPage({
    parent: { database_id: DATABASES.production },
    properties,
    children
  });
};

// Orders database functions
export const getOrders = async (filter?: any, sorts?: any[]) => {
  return await queryDatabase(DATABASES.orders, filter, sorts);
};

export const createOrder = async (properties: any, children?: any[]) => {
  return await createPage({
    parent: { database_id: DATABASES.orders },
    properties,
    children
  });
};

// Expose database IDs for configuration
export const getDatabaseIds = () => {
  return DATABASES;
};

// Update database IDs
export const updateDatabaseId = (key: keyof typeof DATABASES, newId: string) => {
  if (DATABASES[key]) {
    (DATABASES as any)[key] = newId;
    return true;
  }
  return false;
};