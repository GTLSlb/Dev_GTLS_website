const Typesense = require("typesense");
require('dotenv').config();

const host = process.env.TYPESENSE_HOST;
const protocol = process.env.TYPESENSE_PROTOCOL;
const port = process.env.TYPESENSE_PORT;
const apiKey = process.env.TYPESENSE_ADMIN_API_KEY;


const client = new Typesense.Client({
    nodes: [
        {
            host: host, // Your Typesense server host
            port: port, // Your Typesense server port
            protocol: protocol, // Protocol (http or https)
        },
    ],
    apiKey: apiKey, // Your Typesense API key
});

const collectionsToDelete = [
  "aboutuses",
  "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight Test",
  "Introducing Gold Tiger Logistics’ National Road Alerts Feature Test",
  "Introducing Gold Tiger Logistics’ National Road Alerts Feature",
  "branches",
  "capability_statements",
  "certificates",
  "going_greens",
  "news_posts",
  "pallet_terms",
  "positions",
  "safety_compliances",
  "services",
  "socials",
  "team_members",
  "technologies",
  "terms",
];

async function deleteCollections() {
  for (const collectionName of collectionsToDelete) {
    try {
      await client.collections(collectionName).delete();
      console.log(`Deleted collection: ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting collection: ${collectionName}`, error);
    }
  }
}

deleteCollections();
