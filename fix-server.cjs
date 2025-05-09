// Aide à résoudre les problèmes avec le serveur proxy Node.js pour Notion
// Ce script vérifie la configuration et teste la connectivité

console.log('🔍 Vérification du serveur proxy Notion...');

// Vérifier que les variables d'environnement sont correctement chargées
try {
  require('dotenv').config();
  
  console.log('✅ Module dotenv chargé');
  
  if (!process.env.NOTION_API_KEY) {
    console.error('❌ ERREUR: La clé API Notion n\'est pas définie dans le fichier .env');
    console.log('   Veuillez vous assurer que votre fichier .env contient:');
    console.log('   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  } else {
    console.log(`✅ Clé API Notion trouvée (${process.env.NOTION_API_KEY.substring(0, 7)}...)`);
  }
} catch (error) {
  console.error('❌ ERREUR: Impossible de charger le module dotenv:', error.message);
}

// Vérifier que le port est disponible
const net = require('net');
const PORT = process.env.PORT || 3001;

const server = net.createServer();
server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERREUR: Le port ${PORT} est déjà utilisé par un autre processus.`);
    console.log('   Veuillez arrêter ce processus ou changer le port dans .env');
  } else {
    console.error(`❌ ERREUR lors du test du port: ${err.message}`);
  }
  process.exit(1);
});

server.once('listening', () => {
  console.log(`✅ Le port ${PORT} est disponible`);
  server.close();
  
  // Test de l'API Notion
  console.log('🔄 Test de connexion à l\'API Notion...');
  
  try {
    const { Client } = require('@notionhq/client');
    const notionClient = new Client({ auth: process.env.NOTION_API_KEY });
    
    notionClient.users.list({})
      .then(response => {
        console.log('✅ Connexion à l\'API Notion réussie!');
        console.log('   Nombre d\'utilisateurs:', response.results.length);
        
        console.log('\n📋 RÉSUMÉ:');
        console.log('- La clé API Notion est valide');
        console.log('- Le port est disponible');
        console.log('- La connexion à l\'API Notion fonctionne');
        console.log('\n✨ Le serveur proxy est correctement configuré!');
        console.log('   Exécutez "npm run start" pour démarrer l\'application complète.');
      })
      .catch(error => {
        console.error('❌ ERREUR lors de la connexion à l\'API Notion:', error.message);
        
        if (error.message.includes('API token')) {
          console.log('\n⚠️ Il semble que la clé API Notion soit invalide.');
          console.log('   Veuillez vérifier que vous avez entré la bonne clé dans le fichier .env');
        }
      });
  } catch (error) {
    console.error('❌ ERREUR lors du chargement du client Notion:', error.message);
  }
});

server.listen(PORT);