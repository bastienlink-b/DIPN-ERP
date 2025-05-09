import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useN8nWorkflows, useN8nSync } from '../hooks/useN8n';
import { ArrowDownCircle, RefreshCw, CheckCircle2, PlugZap, AlertCircle, Settings, Database } from 'lucide-react';

const N8nIntegrationPage: React.FC = () => {
  const { workflows, isLoading, error } = useN8nWorkflows();
  const { syncERPData, isLoading: isSyncing, error: syncError, syncStatus } = useN8nSync();
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('products');
  
  const handleSync = async () => {
    if (selectedWorkflow) {
      await syncERPData(selectedWorkflow, selectedEntityType);
    }
  };

  const entityTypes = [
    { id: 'products', name: 'Produits' },
    { id: 'contacts', name: 'Contacts' },
    { id: 'orders', name: 'Commandes' },
    { id: 'logistics', name: 'Logistique' },
    { id: 'production', name: 'Production' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Intégration n8n</h1>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          disabled={isLoading}
        >
          Actualiser les workflows
        </Button>
      </div>

      <Card>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-purple-100 rounded-full">
            <PlugZap className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-medium ml-3">Configuration de l'intégration n8n</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          n8n est une plateforme d'automatisation de flux de travail qui permet d'intégrer différentes applications et services.
          Utilisez cette page pour configurer et exécuter des workflows n8n afin de synchroniser des données avec l'ERP DIPN.
        </p>

        {/* Status de connexion */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="font-medium text-red-800">Erreur de connexion à n8n</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <p className="text-sm text-red-700 mt-1">
              Vérifiez que le serveur n8n est en cours d'exécution et que les variables d'environnement sont correctement configurées.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-4 mb-6">
            <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
            <span className="text-sm text-gray-600">Chargement des workflows...</span>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-2" size={20} />
              <span className="font-medium text-green-800">Connecté à n8n</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {workflows.length} workflows disponibles pour l'intégration.
            </p>
          </div>
        )}

        {/* Configuration de la synchronisation */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="workflow" className="block text-sm font-medium text-gray-700 mb-1">
              Workflow n8n à utiliser
            </label>
            <select
              id="workflow"
              value={selectedWorkflow || ''}
              onChange={(e) => setSelectedWorkflow(e.target.value || null)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              disabled={isLoading || workflows.length === 0}
            >
              <option value="">Sélectionnez un workflow</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de données à synchroniser
            </label>
            <select
              id="entityType"
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            >
              {entityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Résultat de synchronisation */}
        {syncStatus.lastSync && (
          <div className={`border rounded-md p-4 mb-6 ${syncStatus.isSuccessful ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center">
              {syncStatus.isSuccessful ? (
                <CheckCircle2 className="text-green-500 mr-2" size={20} />
              ) : (
                <AlertCircle className="text-red-500 mr-2" size={20} />
              )}
              <span className={`font-medium ${syncStatus.isSuccessful ? 'text-green-800' : 'text-red-800'}`}>
                {syncStatus.isSuccessful ? 'Synchronisation réussie' : 'Échec de la synchronisation'}
              </span>
            </div>
            <p className="text-sm mt-1">
              Dernière tentative: {syncStatus.lastSync.toLocaleString()}
            </p>
            {syncError && (
              <p className="text-sm text-red-700 mt-1">{syncError}</p>
            )}
          </div>
        )}

        {/* Bouton de synchronisation */}
        <div className="flex justify-end">
          <Button
            leftIcon={isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <ArrowDownCircle size={16} />}
            disabled={isSyncing || !selectedWorkflow || isLoading}
            onClick={handleSync}
          >
            {isSyncing ? 'Synchronisation en cours...' : 'Synchroniser les données'}
          </Button>
        </div>
      </Card>

      {/* Documentation sur l'intégration */}
      <Card>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-medium ml-3">Guide d'intégration n8n</h2>
        </div>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">1. Configuration de n8n</h3>
            <p>
              Pour utiliser l'intégration n8n avec l'ERP DIPN, vous devez:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Installer et configurer un serveur n8n</li>
              <li>Créer des workflows qui extraient les données de vos sources</li>
              <li>Configurer les variables d'environnement N8N_API_URL et N8N_API_KEY dans votre fichier .env</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">2. Création de workflows</h3>
            <p>
              Les workflows utilisés pour l'intégration doivent retourner des données dans un format compatible avec l'ERP.
              Consultez la documentation pour connaître les structures de données attendues pour chaque type d'entité.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">3. Synchronisation des données</h3>
            <p>
              Une fois vos workflows configurés:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Sélectionnez le workflow à utiliser dans la liste déroulante</li>
              <li>Choisissez le type de données à synchroniser</li>
              <li>Cliquez sur "Synchroniser les données"</li>
              <li>Les données seront automatiquement intégrées dans l'ERP</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-2">4. Résolution des problèmes</h3>
            <p>
              En cas d'erreur de synchronisation:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vérifiez que le serveur n8n est en cours d'exécution</li>
              <li>Assurez-vous que le workflow retourne des données dans le format attendu</li>
              <li>Vérifiez les logs du serveur pour plus de détails sur l'erreur</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Workflows disponibles */}
      {!isLoading && workflows.length > 0 && (
        <Card>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-medium ml-3">Workflows disponibles</h2>
          </div>
          
          <div className="divide-y">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{workflow.name}</h3>
                  <p className="text-sm text-gray-500">ID: {workflow.id}</p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.active ? 'Actif' : 'Inactif'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-3"
                    onClick={() => {
                      setSelectedWorkflow(workflow.id);
                      setSelectedEntityType('products');
                    }}
                  >
                    Sélectionner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default N8nIntegrationPage;