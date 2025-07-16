import { z } from "zod";
import { nanoid } from "nanoid";
import {
  type Voter,
  type Wrestler,
  a_wrestler,
  type Vote,
} from "@/schema/index";
import clientPromise from "@/lib/mongo";
// import { redirect } from "next/navigation"; // TODO: find replacement
import { redirect } from "@tanstack/solid-router";
import { ActionFailedError } from "@/lib/errors";
import { createServerFn } from "@tanstack/solid-start";

export async function handleEmailSubmit(email: string) {
  const validatedEmail = z.string().email().safeParse(email);
  // return validatedEmail;
  if (!validatedEmail.success) {
    return validatedEmail;
  }
  try {
    const client = clientPromise;

    const database = client.db("wotd");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts

    const voterCollection = database.collection<Voter>("submitters");
    const result = await voterCollection.insertOne({
      id: nanoid(),
      email: validatedEmail.data,
      created: new Date().toJSON(),
      voted: null,
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
  if (apiKey !== import.meta.env.UPLOAD_API_KEY) {
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
    const client = clientPromise;

    const database = client.db("wotd");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts

    const wrestlersCollection = database.collection<Wrestler>("wrestlers");
    console.log(JSON.stringify(validatedWrestlers.data, null, 2));

    const uploadResult = await wrestlersCollection.insertMany(
      validatedWrestlers.data,
    );
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

type GetWrestlers = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const getWrestlers = createServerFn({ method: "GET" })
  .validator((data: GetWrestlers) => ({
    page: data.page ?? 0,
    pageSize: data.pageSize ?? 10,
    search: data.search ?? "",
  }))
  .handler(async ({ data }) => {
    const { page, pageSize, search } = data;
    const client = clientPromise;

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

    const rawReturnData = await _collection
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

    const returnData = rawReturnData.map((doc) => ({
      id: doc.id,
      name: doc.name,
      school: doc.school,
    }));

    const totalCount = await _collection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: returnData,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
      },
      search,
    };
  });

// greet({
//   data: {
//     name: "John",
//     age: 34,
//   },
// });

// export async function getWrestlers(page = 0, pageSize = 10, search = "") {
//   // return validatedEmail;

// }

// export async function validateVoteCode(code: string | null) {
//   if (code === null) {
//     redirect({
//       to: "/"
//     });
//   }
//   const client = clientPromise;

//   const database = client.db("wotd");
//   // Specifying a Schema is optional, but it enables type hints on
//   // finds and inserts

//   const voterCollection = database.collection<Voter>("submitters");
//   const result = await voterCollection.findOne({ id: code });

//   if (!result) {
//     redirect({
//       to: "/already-voted"
//     });
//   }

//   if (result.voted !== null) {
//     console.log(`id: ${code} already voted`);
//     redirect({
//       to: "/already-voted"
//     });
//   }
//   return "validated";
// }

// export async function submitVote(code: string, wrestlerId: string) {
//   const client = clientPromise;
//   const database = client.db("wotd");
//   const votesCollection = database.collection<Vote>("votes");
//   const voterCollection = database.collection<Voter>("submitters");

//   const voteExists = await votesCollection.findOne({ voteId: code });
//   const voter = await voterCollection.findOne({ id: code });
//   if (voteExists === null && voter !== null) {
//     const voteResult = await votesCollection.insertOne({
//       voteDateTime: new Date().toJSON(),
//       voteKey: code,
//       wrestlerId: wrestlerId,
//     });
//     const voterResult = await voterCollection.updateOne(voter, {
//       $set: {
//         voted: new Date().toJSON(),
//       },
//     });
//     console.log(JSON.stringify({ voteResult, voterResult }, null, 2));
//     redirect({
//       to: "/vote-submitted"
//     });
//   }
//   throw new ActionFailedError("There is already a vote logged for this User.");
// }
