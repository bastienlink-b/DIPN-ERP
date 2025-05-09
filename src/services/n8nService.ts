import axios from 'axios';

// Configuration par défaut pour l'API n8n
const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

// Proxy API base URL - pour les requêtes n8n
const API_BASE_URL = '/api/n8n';

// Types de base pour les workflows et les exécutions
interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  [key: string]: any;
}

interface N8nExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  data: any;
  [key: string]: any;
}

/**
 * Récupérer tous les workflows disponibles
 */
export const getWorkflows = async (): Promise<{ success: boolean; data?: N8nWorkflow[]; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workflows`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Erreur lors de la récupération des workflows:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupérer un workflow spécifique par son ID
 */
export const getWorkflow = async (id: string): Promise<{ success: boolean; data?: N8nWorkflow; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workflows/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Erreur lors de la récupération du workflow ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Exécuter un workflow par son ID avec des données d'entrée
 */
export const executeWorkflow = async (id: string, data: any = {}): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workflows/${id}/execute`, { data });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Erreur lors de l'exécution du workflow ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupérer les exécutions d'un workflow
 */
export const getWorkflowExecutions = async (workflowId: string): Promise<{ success: boolean; data?: N8nExecution[]; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/executions`, {
      params: { workflowId }
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error(`Erreur lors de la récupération des exécutions pour le workflow ${workflowId}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupérer une exécution spécifique par son ID
 */
export const getExecution = async (id: string): Promise<{ success: boolean; data?: N8nExecution; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/executions/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'exécution ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Synchroniser les données de l'ERP à partir d'un workflow spécifique
 * Cette fonction est utilisée pour mettre à jour les données de l'ERP à partir des données n8n
 */
export const syncERPData = async (workflowId: string, entityType: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sync`, { 
      workflowId,
      entityType 
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Erreur lors de la synchronisation des données ERP pour ${entityType}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

export default {
  getWorkflows,
  getWorkflow,
  executeWorkflow,
  getWorkflowExecutions,
  getExecution,
  syncERPData
};