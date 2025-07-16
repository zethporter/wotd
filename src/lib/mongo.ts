import { MongoClient } from "mongodb";

if (!import.meta.env.MONGO_CONNECTION_STRING) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGO_CONNECTION_STRING"',
  );
}

const uri = import.meta.env.MONGO_CONNECTION_STRING;

let client: MongoClient;

if (import.meta.env.MODE === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.

export default client;
