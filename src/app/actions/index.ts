"use server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { MongoClient } from "mongodb";
import { type Voter } from "@/schema";

const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri ?? "");

export async function handleEmailSubmit(email: string) {
  const validatedEmail = z.string().email().safeParse(email);
  // return validatedEmail;
  if (!validatedEmail.success) {
    return validatedEmail;
  }
  try {
    const database = client.db("wotd");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts

    const voterCollection = database.collection<Voter>("submitters");
    const result = await voterCollection.insertOne({
      id: nanoid(),
      email: validatedEmail.data,
      created: new Date().toJSON(),
      voted: null,
      votedForId: null,
    });

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return { success: true, message: "You should have received an email" };
  } catch {
    return {
      success: false,
      message:
        "Something went wrong. Please try again. Or try with a different email",
    };
  } finally {
    await client.close();
  }
}
