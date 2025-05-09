import React, { useState, useEffect } from 'react';
import NotionConnectionForm from '../components/ui/NotionConnectionForm';
import NotionDatabaseConfig from '../components/ui/NotionDatabaseConfig';
import { useNotionConnection, useNotionConfig } from '../hooks/useNotion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Database, RefreshCw, Settings, CheckCircle2, XCircle } from 'lucide-react';

const NotionSettingsPage: React.FC = () => {
  const { isConnected, isLoading, error } = useNotionConnection();
  const { getDatabaseIds } = useNotionConfig();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [databaseIds, setDatabaseIds] = useState<Record<string, string>>({});

  useEffect(() => {
    setDatabaseIds(getDatabaseIds());
  }, [getDatabaseIds]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force reload to check connection again
    window.location.reload();
  };

  const databaseConfigs = [
    {
      key: 'products',
      title: 'Produits',
      description: 'Base de données pour les produits et composants'
    },
    {
      key: 'contacts',
      title: 'Contacts',
      description: 'Base de données pour les clients et fournisseurs'
    },
    {
      key: 'logistics',
      title: 'Logistique',
      description: 'Base de données pour la gestion logistique'
    },
    {
      key: 'production',
      title: 'Production',
      description: 'Base de données pour le suivi de production'
    },
    {
      key: 'orders',
      title: 'Commandes',
      description: 'Base de données pour les commandes clients et fournisseurs'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Configuration Notion</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium ml-3">Paramètres de connexion</h2>
          </div>
          
          <NotionConnectionForm />
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-medium ml-3">Statut</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="animate-spin text-blue-600 mr-2" size={20} />
              <span>Vérification...</span>
            </div>
          ) : isConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 mr-2" size={20} />
                <span className="font-medium text-green-800">Connecté</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                L'API Notion est correctement configurée avec la clé préconfigurée.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                leftIcon={<RefreshCw size={14} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Actualisation...' : 'Vérifier à nouveau'}
              </Button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <XCircle className="text-red-500 mr-2" size={20} />
                <span className="font-medium text-red-800">Non connecté</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                {error || "Erreur de connexion à l'API Notion."}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                leftIcon={<RefreshCw size={14} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Actualisation...' : 'Vérifier à nouveau'}
              </Button>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-green-100 rounded-full">
            <Database className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-lg font-medium ml-3">Bases de données Notion</h2>
        </div>
        
        {!isConnected ? (
          <div className="text-center py-6 text-gray-500">
            Connectez-vous à Notion pour configurer vos bases de données
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Configurez les bases de données Notion à utiliser pour chaque module de l'ERP. Les ID des bases ont été pré-remplis avec les valeurs que vous avez fournies.
            </p>
            
            <div className="space-y-4">
              {databaseConfigs.map((config) => (
                <NotionDatabaseConfig 
                  key={config.key}
                  databaseKey={config.key}
                  databaseId={databaseIds[config.key] || ''}
                  title={config.title}
                  description={config.description}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-medium ml-3">Documentation</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pour utiliser correctement les bases de données Notion avec cette application, suivez ces instructions :
          </p>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">1. Authentification</h3>
              <p>
                Utilisez la clé d'API Notion (Internal Integration Token) pour vous connecter à l'API Notion.
                Cette clé est utilisée comme token d'autorisation pour toutes les requêtes.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">2. IDs des bases de données</h3>
              <p>
                Chaque base de données Notion a un identifiant unique. Il est essentiel que vos bases de données
                soient partagées avec votre intégration Notion pour que l'application puisse y accéder.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">3. Structure des bases de données</h3>
              <p>
                Pour que l'application fonctionne correctement, vos bases de données Notion doivent suivre une structure spécifique.
                Consultez la documentation pour connaître les colonnes et propriétés requises pour chaque base.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">4. Résolution des problèmes</h3>
              <p>
                Si vous rencontrez des erreurs de connexion, vérifiez que :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Votre clé API est correcte et active</li>
                <li>Les IDs de base de données sont corrects</li>
                <li>Les bases de données sont partagées avec votre intégration</li>
                <li>Votre intégration a les permissions nécessaires (lecture/écriture)</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotionSettingsPage;