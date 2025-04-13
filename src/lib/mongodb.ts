// lib/mongodb.js
import { MongoClient } from "mongodb";

const options = {};
const uri = process.env.MONGO_CONNECTION_STRING;

if (!process.env.MONGO_CONNECTION_STRING) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const client: MongoClient = new MongoClient(uri!, options);
const clientPromise: Promise<MongoClient> = client.connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be safely reused across multiple
// functions.
export default clientPromise;
