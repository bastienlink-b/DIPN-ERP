import { useState, useEffect, useCallback } from 'react';
import * as notionService from '../services/notionService';

export const useNotionConnection = () => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isConnected: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Notion connection...");
        
        const result = await notionService.testConnection();
        
        if (result.isConnected) {
          setStatus({
            isConnected: true,
            isLoading: false,
            error: null
          });
        } else {
          setStatus({
            isConnected: false,
            isLoading: false,
            error: result.error || 'Failed to connect to Notion API'
          });
        }
      } catch (error) {
        console.error("Connection error:", error);
        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setStatus({
          isConnected: false,
          isLoading: false,
          error: errorMessage
        });
      }
    };

    checkConnection();
  }, []);

  return status;
};

export const useNotionDatabase = (databaseId: string) => {
  const [database, setDatabase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabase = async () => {
      if (!databaseId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await notionService.getDatabase(databaseId);
        
        if (response.success) {
          setDatabase(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch database');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabase();
  }, [databaseId]);

  const queryDatabaseData = async (options: { filter?: any; sorts?: any[] } = {}) => {
    if (!databaseId) return null;
    
    setIsLoading(true);
    
    try {
      const response = await notionService.queryDatabase(databaseId, options.filter, options.sorts);
      
      if (response.success) {
        setError(null);
        return response.data;
      } else {
        setError(response.error || 'Failed to query database');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { database, isLoading, error, queryDatabase: queryDatabaseData };
};

export const useNotionDatabaseConnection = (databaseId: string) => {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    name: string | null;
  }>({
    isConnected: false,
    isLoading: true,
    error: null,
    name: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (!databaseId) {
        setStatus({
          isConnected: false,
          isLoading: false,
          error: 'No database ID provided',
          name: null
        });
        return;
      }

      try {
        const result = await notionService.testDatabaseConnection(databaseId);
        
        if (result.isConnected) {
          setStatus({
            isConnected: true,
            isLoading: false,
            error: null,
            name: result.name || null
          });
        } else {
          setStatus({
            isConnected: false,
            isLoading: false,
            error: result.error || 'Failed to connect to database',
            name: null
          });
        }
      } catch (error) {
        let errorMessage = 'Unknown error occurred';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setStatus({
          isConnected: false,
          isLoading: false,
          error: errorMessage,
          name: null
        });
      }
    };

    checkConnection();
  }, [databaseId]);

  return status;
};

export const useNotionPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createNotionPage = async (data: {
    parent: { database_id: string } | { page_id: string };
    properties: any;
    children?: any[];
  }) => {
    setIsLoading(true);
    
    try {
      const response = await notionService.createPage(data);
      
      if (response.success) {
        setError(null);
        return response.data;
      } else {
        setError(response.error || 'Failed to create page');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotionPage = async (pageId: string, properties: any) => {
    setIsLoading(true);
    
    try {
      const response = await notionService.updatePage(pageId, properties);
      
      if (response.success) {
        setError(null);
        return response.data;
      } else {
        setError(response.error || 'Failed to update page');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const archiveNotionPage = async (pageId: string) => {
    setIsLoading(true);
    
    try {
      const response = await notionService.archivePage(pageId);
      
      if (response.success) {
        setError(null);
        return response.data;
      } else {
        setError(response.error || 'Failed to archive page');
        return null;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    createPage: createNotionPage, 
    updatePage: updateNotionPage, 
    archivePage: archiveNotionPage,
    isLoading, 
    error 
  };
};

export const useNotionConfig = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get database IDs
  const getDatabaseIds = useCallback(() => {
    return notionService.getDatabaseIds();
  }, []);

  // Update a database ID
  const updateDatabaseId = useCallback(async (key: string, newId: string) => {
    setIsUpdating(true);
    try {
      // First test if the database is accessible
      const result = await notionService.testDatabaseConnection(newId);
      
      if (result.isConnected) {
        // Update the database ID
        const updated = notionService.updateDatabaseId(key as any, newId);
        return { 
          success: updated, 
          name: result.name, 
          error: updated ? null : 'Failed to update database ID' 
        };
      } else {
        return { 
          success: false, 
          name: null, 
          error: result.error || 'Cannot connect to the specified database' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        name: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { getDatabaseIds, updateDatabaseId, isUpdating };
};