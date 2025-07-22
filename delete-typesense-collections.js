/* eslint-disable */
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


async function deleteAllCollections(){
  try {
    // Get all collections
    const collections = await client.collections().retrieve();

    for (const collection of collections) {
      // Delete each collection
      await client.collections(collection.name).delete();
      console.log(`Deleted collection: ${collection.name}`);
    }

    console.log("All collections have been deleted.");
  } catch (error) {
    console.error("Error deleting collections:", error);
  }
};

deleteAllCollections();
