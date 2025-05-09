import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Database, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNotionDatabaseConnection, useNotionConfig } from '../../hooks/useNotion';

interface NotionDatabaseConfigProps {
  databaseKey: string;
  databaseId: string;
  title: string;
  description: string;
}

const NotionDatabaseConfig: React.FC<NotionDatabaseConfigProps> = ({
  databaseKey,
  databaseId,
  title,
  description
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDatabaseId, setNewDatabaseId] = useState(databaseId);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const { isConnected, isLoading, error, name } = useNotionDatabaseConnection(databaseId);
  const { updateDatabaseId, isUpdating } = useNotionConfig();

  const handleEdit = () => {
    setIsEditing(true);
    setNewDatabaseId(databaseId);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewDatabaseId(databaseId);
    setUpdateError(null);
  };

  const handleSave = async () => {
    if (!newDatabaseId.trim()) {
      setUpdateError('Veuillez entrer un ID de base de données');
      return;
    }

    try {
      const result = await updateDatabaseId(databaseKey, newDatabaseId);
      
      if (result.success) {
        setUpdateSuccess(true);
        setUpdateError(null);
        setIsEditing(false);
        // On pourrait recharger la page ici, mais dans une application réelle,
        // on mettrait plutôt à jour l'état local pour refléter le changement
      } else {
        setUpdateError(result.error || 'Erreur lors de la mise à jour de l\'ID de la base de données');
      }
    } catch (error) {
      setUpdateError('Une erreur inattendue s\'est produite');
    }
  };

  return (
    <Card className="border mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        {isConnected && !isEditing && (
          <div className="flex items-center text-green-600">
            <CheckCircle2 size={16} className="mr-1" />
            <span className="text-sm">Connecté</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin text-blue-600 mr-2" size={20} />
          <span className="text-sm text-gray-600">Vérification de la connexion...</span>
        </div>
      ) : isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor={`db-id-${databaseKey}`} className="block text-sm font-medium text-gray-700 mb-1">
              ID de la base de données
            </label>
            <input
              type="text"
              id={`db-id-${databaseKey}`}
              value={newDatabaseId}
              onChange={(e) => setNewDatabaseId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              placeholder="1ebc089bcd7480..."
            />
          </div>
          
          {updateError && (
            <div className="text-sm text-red-600">{updateError}</div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              leftIcon={isUpdating ? <Loader2 className="animate-spin" size={14} /> : undefined}
            >
              {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">ID de la base de données</p>
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 break-all">
              {databaseId}
            </div>
          </div>
          
          {isConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle2 className="text-green-500 mr-2" size={16} />
                <span className="text-sm text-green-800">Base connectée{name ? ` : ${name}` : ''}</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <XCircle className="text-red-500 mr-2" size={16} />
                <span className="text-sm text-red-800">Problème de connexion</span>
              </div>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              Modifier
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NotionDatabaseConfig;