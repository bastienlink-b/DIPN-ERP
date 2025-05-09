import { Client } from "@notionhq/client";

export default {
  async fetch(request, env, ctx) {
    // Configurer CORS pour permettre les requêtes depuis votre application
    if (request.method === "OPTIONS") {
      return handleCors();
    }

    // Extraire le chemin de la requête
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, '');

    try {
      // Router les requêtes vers les gestionnaires appropriés
      if (path === "validate" || path === "validate/") {
        return await handleValidate(request);
      } else if (path === "sync" || path === "sync/") {
        return await handleSync(request);
      } else if (path === "fetch" || path === "fetch/") {
        return await handleFetch(request);
      } else {
        return new Response(JSON.stringify({ error: "Endpoint non trouvé", path: path }), {
          status: 404,
          headers: corsHeaders()
        });
      }
    } catch (error) {
      console.error("Erreur dans le worker:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

// Gérer la validation des clés API Notion
async function handleValidate(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    // Check if the request has a JSON body
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ valid: false, error: "Content-Type must be application/json" }), {
        status: 400,
        headers: corsHeaders()
      });
    }
    
    // Safely parse the JSON body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid JSON in request body" }), {
        status: 400,
        headers: corsHeaders()
      });
    }
    
    const { apiKey } = body;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ valid: false, error: "Clé API manquante" }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    try {
      // Tentative d'initialisation du client avec la clé fournie
      const notion = new Client({ auth: apiKey });
      
      // Vérifier si la clé fonctionne en récupérant la liste des utilisateurs
      const response = await notion.users.list({});
      
      return new Response(JSON.stringify({ valid: true }), {
        headers: corsHeaders()
      });
    } catch (error) {
      console.error("Erreur de validation de la clé API:", error);
      return new Response(JSON.stringify({ valid: false, error: error.message }), {
        status: 400,
        headers: corsHeaders()
      });
    }
  } catch (error) {
    console.error("Exception in handleValidate:", error);
    return new Response(JSON.stringify({ valid: false, error: "Internal server error: " + error.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

// Gérer la synchronisation des données vers Notion
async function handleSync(request) {
  const { apiKey, databaseId, type, data } = await request.json();
  
  if (!apiKey || !databaseId || !type || !data) {
    return new Response(JSON.stringify({ error: "Paramètres manquants" }), {
      status: 400,
      headers: corsHeaders()
    });
  }

  try {
    const notion = new Client({ auth: apiKey });
    
    // Obtenir la structure actuelle de la base de données
    const database = await notion.databases.retrieve({ database_id: databaseId });
    
    // Synchroniser chaque élément
    const results = [];
    for (const item of data) {
      try {
        // Préparer les propriétés en fonction du type de données
        const properties = prepareProperties(item, type, database.properties);
        
        // Rechercher si l'élément existe déjà par son ID ou une autre propriété unique
        const existingPages = await findExistingPages(notion, databaseId, item, type);
        
        let result;
        if (existingPages.length > 0) {
          // Mettre à jour la page existante
          result = await notion.pages.update({
            page_id: existingPages[0].id,
            properties
          });
        } else {
          // Créer une nouvelle page
          result = await notion.pages.create({
            parent: { database_id: databaseId },
            properties
          });
        }
        
        results.push({ success: true, id: result.id });
      } catch (itemError) {
        console.error(`Erreur lors de la synchronisation de l'élément:`, itemError);
        results.push({ success: false, error: itemError.message });
      }
    }
    
    return new Response(JSON.stringify({ success: true, results }), {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error("Erreur de synchronisation:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

// Gérer la récupération des données depuis Notion
async function handleFetch(request) {
  const { apiKey, databaseId, type } = await request.json();
  
  if (!apiKey || !databaseId) {
    return new Response(JSON.stringify({ error: "Paramètres manquants" }), {
      status: 400,
      headers: corsHeaders()
    });
  }

  try {
    const notion = new Client({ auth: apiKey });
    
    // Récupérer toutes les pages de la base de données
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100
    });
    
    // Transformer les données Notion en format utilisable par l'application
    const results = await Promise.all(response.results.map(async (page) => {
      return await transformNotionPage(page, type, notion);
    }));
    
    return new Response(JSON.stringify({ success: true, results }), {
      headers: corsHeaders()
    });
  } catch (error) {
    console.error("Erreur de récupération:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

// Fonctions auxiliaires

// Configurer les en-têtes CORS
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

// Gérer les requêtes CORS préliminaires
function handleCors() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

// Préparer les propriétés Notion en fonction du type de données
function prepareProperties(item, type, dbProperties) {
  const properties = {};

  // Adapter en fonction du type de données
  switch (type) {
    case 'products':
      if (dbProperties.Nom) properties.Nom = { title: [{ text: { content: item.name } }] };
      if (dbProperties.Référence) properties.Référence = { rich_text: [{ text: { content: item.referenceNumber } }] };
      if (dbProperties.Description) properties.Description = { rich_text: [{ text: { content: item.description } }] };
      if (dbProperties.Prix) properties.Prix = { number: item.unitPrice };
      break;
      
    case 'projects':
      if (dbProperties.Nom) properties.Nom = { title: [{ text: { content: item.name } }] };
      if (dbProperties.Description) properties.Description = { rich_text: [{ text: { content: item.description } }] };
      if (dbProperties.Status) properties.Status = { select: { name: item.status } };
      if (dbProperties["Date de création"]) {
        properties["Date de création"] = { date: { start: item.createdDate } };
      }
      break;
      
    case 'orders':
      if (dbProperties.Référence) properties.Référence = { title: [{ text: { content: item.reference } }] };
      if (dbProperties.Client) properties.Client = { rich_text: [{ text: { content: item.customer.name } }] };
      if (dbProperties.Statut) properties.Statut = { select: { name: item.status } };
      if (dbProperties["Date de commande"]) {
        properties["Date de commande"] = { date: { start: item.orderDate } };
      }
      break;
      
    case 'contacts':
      if (dbProperties.Nom) properties.Nom = { title: [{ text: { content: item.name } }] };
      if (dbProperties.Email) properties.Email = { email: item.email };
      if (dbProperties.Téléphone) properties.Téléphone = { phone_number: item.phone };
      if (dbProperties.Adresse) properties.Adresse = { rich_text: [{ text: { content: item.address } }] };
      break;
  }

  return properties;
}

// Rechercher des pages existantes pour éviter les doublons
async function findExistingPages(notion, databaseId, item, type) {
  let filter = {};
  
  // Créer un filtre en fonction du type de données
  switch (type) {
    case 'products':
      filter = {
        property: 'Référence',
        rich_text: { equals: item.referenceNumber }
      };
      break;
      
    case 'projects':
      filter = {
        property: 'Nom',
        title: { equals: item.name }
      };
      break;
      
    case 'orders':
      filter = {
        property: 'Référence',
        title: { equals: item.reference }
      };
      break;
      
    case 'contacts':
      filter = {
        property: 'Email',
        email: { equals: item.email }
      };
      break;
  }
  
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter
  });
  
  return response.results;
}

// Transformer une page Notion en objet utilisable par l'application
async function transformNotionPage(page, type, notion) {
  const props = page.properties;
  const result = { id: page.id };
  
  // Adapter en fonction du type de données
  switch (type) {
    case 'products':
      if (props.Nom) result.name = props.Nom.title.map(t => t.plain_text).join('');
      if (props.Référence) result.referenceNumber = props.Référence.rich_text.map(t => t.plain_text).join('');
      if (props.Description) result.description = props.Description.rich_text.map(t => t.plain_text).join('');
      if (props.Prix) result.unitPrice = props.Prix.number;
      break;
      
    case 'projects':
      if (props.Nom) result.name = props.Nom.title.map(t => t.plain_text).join('');
      if (props.Description) result.description = props.Description.rich_text.map(t => t.plain_text).join('');
      if (props.Status) result.status = props.Status.select?.name;
      if (props["Date de création"]) result.createdDate = props["Date de création"].date?.start;
      break;
      
    case 'orders':
      if (props.Référence) result.reference = props.Référence.title.map(t => t.plain_text).join('');
      if (props.Client) result.customerName = props.Client.rich_text.map(t => t.plain_text).join('');
      if (props.Statut) result.status = props.Statut.select?.name;
      if (props["Date de commande"]) result.orderDate = props["Date de commande"].date?.start;
      break;
      
    case 'contacts':
      if (props.Nom) result.name = props.Nom.title.map(t => t.plain_text).join('');
      if (props.Email) result.email = props.Email.email;
      if (props.Téléphone) result.phone = props.Téléphone.phone_number;
      if (props.Adresse) result.address = props.Adresse.rich_text.map(t => t.plain_text).join('');
      break;
  }
  
  return result;
}