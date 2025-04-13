"use client";
// import Link from "next/link";
import { toast } from "sonner";
import { useState, type ChangeEvent } from "react";
import Papa from "papaparse";
import { nanoid } from "nanoid";
import { type Wrestler, a_wrestler } from "@/schema";
import { handleWrestlersUpload } from "../actions";

export default function EnterVoteCode() {
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([]);
  const [apiKey, setApiKey] = useState("");

  const handleUpload = async () => {
    toast.loading("Uploading Wrestlers", { id: "wrestlers" });
    const result = await handleWrestlersUpload(wrestlers, apiKey);
    if (result.success) {
      toast.success(result.message, { id: "wrestlers" });
    } else {
      console.log({ result });
      toast.error(result.message, { id: "wrestlers" });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    toast.loading("Validating Wrestlers list", { id: "wrestlers" });

    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Optional: Validate file type client-side (browser might allow others despite 'accept')
      if (
        file?.type !== "text/csv" &&
        !file?.name.toLowerCase().endsWith(".csv")
      ) {
        toast.error("Error: Please select a valid .csv file.", {
          id: "wrestlers",
        });
        // Clear the file input value so the user can select the same file again if needed
        event.target.value = "";
        return;
      }

      // Use PapaParse to parse the CSV file
      Papa.parse(file, {
        // Pass the interface type to Papa.parse
        header: true, // Treat the first row as headers
        skipEmptyLines: true, // Skip empty rows
        dynamicTyping: true, // Automatically convert numbers and booleans
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("Parsing errors:", results.errors);
            // Display the first few errors
            const errorMessages = results.errors
              .slice(0, 3)
              .map((err) => `${err.code}: ${err.message} (Row: ${err.row})`)
              .join("\n");

            toast.error(`Parsing errors: ${errorMessages}`);
          } else {
            const _wrestlers = results.data.map((w) => {
              const _id = nanoid();
              w.id = _id;
              return w;
            });
            const parsedWrestlers = a_wrestler.safeParse(_wrestlers);

            if (parsedWrestlers.success) {
              setWrestlers(parsedWrestlers.data);
              toast.success("Wrestlers Ready for Upload", { id: "wrestlers" });
            } else {
              toast.error("Provided CSV was not the proper format", {
                id: "wrestlers",
              });
            }
          }
        },
        error: (err) => {
          toast.error(`PapaParse Error: ${err}`, { id: "wrestlers" });
        },
      });
    } else {
      toast.warning("No file selected.", { id: "wrestlers" });
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 p-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleUpload(wrestlers, apiKey);
          }}
          className="fieldset w-sm md:w-md"
        >
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-6">
            <div className="grow">
              <label className="input input-lg md:input-xl input-secondary join-item w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>

                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  placeholder="apiKey"
                />
              </label>
            </div>
            <input
              onChange={handleFileChange}
              type="file"
              className="file-input file-input-lg file-input-secondary md:file-input-xl w-full"
            />

            <button
              type="submit"
              className="btn btn-md md:btn-lg btn-block btn-secondary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 stroke-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
              Upload Wrestlers
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>{`Total: ${wrestlers.length}`}</th>
              <th>Name</th>
              <th>School</th>
            </tr>
          </thead>
          <tbody>
            {wrestlers.map((wrestler: Wrestler, i) => (
              <tr key={wrestler.id} className="bg-base-200">
                <th>{i + 1}</th>
                <td>{wrestler.name}</td>
                <td>{wrestler.school}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
