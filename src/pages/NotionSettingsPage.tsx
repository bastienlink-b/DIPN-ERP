import React, { useState } from 'react';
import NotionConnectionForm from '../components/ui/NotionConnectionForm';
import { useNotionConnection } from '../hooks/useNotion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Database, RefreshCw, Settings, CheckCircle2, XCircle } from 'lucide-react';

const NotionSettingsPage: React.FC = () => {
  const { isConnected, isLoading, error } = useNotionConnection();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force reload to check connection again
    window.location.reload();
  };

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
            Connectez-vous à Notion pour voir vos bases de données
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Une fois connecté, vous pourrez configurer les bases de données Notion à utiliser pour chaque module de l'ERP.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Commandes</h3>
                <p className="text-sm text-gray-500 mt-1">Base de données pour les commandes clients et fournisseurs</p>
                <Button variant="outline" size="sm" className="mt-3">Configurer</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Production</h3>
                <p className="text-sm text-gray-500 mt-1">Base de données pour le suivi de production</p>
                <Button variant="outline" size="sm" className="mt-3">Configurer</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Contacts</h3>
                <p className="text-sm text-gray-500 mt-1">Base de données pour les clients et fournisseurs</p>
                <Button variant="outline" size="sm" className="mt-3">Configurer</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Produits</h3>
                <p className="text-sm text-gray-500 mt-1">Base de données pour les produits et composants</p>
                <Button variant="outline" size="sm" className="mt-3">Configurer</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotionSettingsPage;