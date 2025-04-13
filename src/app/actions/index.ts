"use server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { type Voter, type Wrestler, a_wrestler } from "@/schema";
import clientPromise from "@/lib/mongodb";

export async function handleEmailSubmit(email: string) {
  const validatedEmail = z.string().email().safeParse(email);
  // return validatedEmail;
  if (!validatedEmail.success) {
    return validatedEmail;
  }
  try {
    const client = await clientPromise;
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
    console.log(JSON.stringify(result, null, 2));
    return { success: true, message: "You should have received an email" };
  } catch (error) {
    console.log("error", JSON.stringify(error, null, 2));
    return {
      success: false,
      message:
        "Something went wrong. Please try again. Or try with a different email",
    };
  }
}

export async function handleWrestlersUpload(
  wrestlers: Wrestler[],
  apiKey: string,
) {
  if (apiKey !== process.env.UPLOAD_API_KEY) {
    return {
      success: false,
      message: "invalid api key",
    };
  }
  const validatedWrestlers = a_wrestler.safeParse(wrestlers);
  // return validatedEmail;
  if (!validatedWrestlers.success) {
    return {
      success: false,
      message: "something went wrong validating wrestlers",
      error: validatedWrestlers.error,
    };
  }
  try {
    const client = await clientPromise;
    const database = client.db("wotd");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts

    const _collection = database.collection<Wrestler>("wrestlers");
    console.log(JSON.stringify(validatedWrestlers.data, null, 2));

    const uploadResult = await _collection.insertMany(validatedWrestlers.data);
    console.log(JSON.stringify(uploadResult, null, 2));
    return { success: true, message: "Wrestlers Uploaded" };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getWrestlers(page = 0, pageSize = 10, search = "") {
  // return validatedEmail;
  try {
    const client = await clientPromise;
    const database = client.db("wotd");
    const _collection = database.collection<Wrestler>("wrestlers");

    const skip = page * pageSize;

    const query = search
      ? {
          $text: {
            $search: search,
          },
        } // Use text index if searching
      : {};

    console.log("query", JSON.stringify(query));

    const data = await _collection
      .find(query, {
        projection: {
          _id: 0, // Exclude the _id field
          id: 1,
          name: 1, // Include the name field
          school: 1, // Include the category field
        },
      })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await _collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
      },
      search,
    };
  } catch (e) {
    console.error(e);
    return { data: [], pagination: null, search: null }; // Or handle the error as needed
  }
}
