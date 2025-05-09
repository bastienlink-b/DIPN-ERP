import React, { useState, useEffect } from 'react';
import { useNotionConnection } from '../../hooks/useNotion';
import Button from './Button';
import Card from './Card';
import { Key, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface NotionConnectionFormProps {
  onConnect?: () => void;
}

const NotionConnectionForm: React.FC<NotionConnectionFormProps> = ({ onConnect }) => {
  // Use the pre-configured API key
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { isConnected, isLoading, error } = useNotionConnection();

  // Load the API key on component mount
  useEffect(() => {
    // La clé est déjà configurée dans l'environnement ou par défaut dans le service
    setApiKey('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');
    setSaveSuccess(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setSaveError('Veuillez entrer une clé API Notion');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Dans une application réelle, nous enregistrerions ceci dans un emplacement sécurisé via une API
      // Pour cette démo, nous simulons simplement un enregistrement réussi
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour le fichier .env avec la clé API (cela serait fait côté serveur dans une vraie application)
      setSaveSuccess(true);
      
      if (onConnect) {
        onConnect();
      }
      
      // Forcer le rechargement pour appliquer la nouvelle clé API
      window.location.reload();
    } catch (error) {
      setSaveError('Erreur lors de la sauvegarde de la clé API');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Forcer le rechargement pour vérifier à nouveau la connexion
    window.location.reload();
  };

  return (
    <Card title="Configuration de la connexion Notion" className="max-w-md mx-auto">
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="animate-spin text-blue-600 mr-2" size={20} />
          <span>Vérification de la connexion...</span>
        </div>
      ) : isConnected ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="text-green-500 mr-2" size={20} />
            <span className="font-medium text-green-800">Connecté à l'API Notion</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Votre application est correctement connectée à l'API Notion avec la clé préconfigurée.
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
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex items-center">
                <XCircle className="text-red-500 mr-2" size={20} />
                <span className="font-medium text-red-800">Erreur de connexion</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clé API Notion
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Vous pouvez trouver votre clé API dans les paramètres d'intégration de Notion.
              </p>
            </div>
            
            {saveError && (
              <div className="text-sm text-red-600 mb-4">{saveError}</div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2" size={16} />
                  <span className="text-sm text-green-800">Clé API déjà configurée</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving || saveSuccess}
                leftIcon={isSaving ? <Loader2 className="animate-spin" size={16} /> : undefined}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer la clé API'}
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};

export default NotionConnectionForm;