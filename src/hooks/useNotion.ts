import { useState, useEffect } from 'react';
import { testConnection, queryDatabase, getDatabase, createPage, updatePage } from '../services/notionService';

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
        
        const result = await testConnection();
        
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
        const response = await getDatabase(databaseId);
        
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
      const response = await queryDatabase(databaseId, options.filter, options.sorts);
      
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
      const response = await createPage(data);
      
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
      const response = await updatePage(pageId, properties);
      
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

  return { createPage: createNotionPage, updatePage: updateNotionPage, isLoading, error };
};