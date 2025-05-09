import { useState, useEffect, useCallback } from 'react';
import * as n8nService from '../services/n8nService';

export const useN8nWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const result = await n8nService.getWorkflows();
        
        if (result.success && result.data) {
          setWorkflows(result.data);
          setError(null);
        } else {
          setError(result.error || 'Erreur lors de la récupération des workflows');
        }
      } catch (error) {
        let errorMessage = 'Erreur inconnue';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  return { workflows, isLoading, error };
};

export const useN8nWorkflow = (workflowId: string) => {
  const [workflow, setWorkflow] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await n8nService.getWorkflow(workflowId);
        
        if (result.success && result.data) {
          setWorkflow(result.data);
          setError(null);
        } else {
          setError(result.error || 'Erreur lors de la récupération du workflow');
        }
      } catch (error) {
        let errorMessage = 'Erreur inconnue';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId]);

  const executeWorkflow = useCallback(async (data: any = {}) => {
    if (!workflowId) return null;
    
    setIsLoading(true);
    
    try {
      const result = await n8nService.executeWorkflow(workflowId, data);
      
      if (result.success) {
        setError(null);
        return result.data;
      } else {
        setError(result.error || 'Erreur lors de l\'exécution du workflow');
        return null;
      }
    } catch (error) {
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  return { workflow, isLoading, error, executeWorkflow };
};

export const useN8nSync = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    lastSync: Date | null;
    isSuccessful: boolean;
  }>({
    lastSync: null,
    isSuccessful: false
  });

  const syncERPData = useCallback(async (workflowId: string, entityType: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await n8nService.syncERPData(workflowId, entityType);
      
      if (result.success) {
        setSyncStatus({
          lastSync: new Date(),
          isSuccessful: true
        });
        return result.data;
      } else {
        setSyncStatus({
          lastSync: new Date(),
          isSuccessful: false
        });
        setError(result.error || 'Erreur lors de la synchronisation');
        return null;
      }
    } catch (error) {
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSyncStatus({
        lastSync: new Date(),
        isSuccessful: false
      });
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, syncStatus, syncERPData };
};