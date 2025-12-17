import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Droppable } from "./ui/file-dropzone";
import { SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { IconUsersPlus } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { type ChangeEvent } from "react";
import Papa from "papaparse";
import { wrestlersCollection } from "@/routes/__root";
import { massWrestler } from "@/schema";
import z from "zod";

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
          const errors = [];
          const _wrestlers = [];
          // const _wrestlers = massWrestler.safeParse(results.data);
          for (const wrestler of results.data) {
            const _wrestler = massWrestler.safeParse(wrestler);
            if (_wrestler.success) {
              _wrestlers.push(_wrestler.data);
            } else {
              errors.push(z.prettifyError(_wrestler.error));
            }
          }

          if (_wrestlers.length > 0) {
            toast.success("Wrestlers Validated", { id: "wrestlers" });
            // console.debug({ _wrestlers });
            wrestlersCollection.insert(_wrestlers);
          } else {
            toast.warning("No Valid Wrestlers Found", { id: "wrestlers" });
          }

          if (errors.length > 0) {
            toast.error("There were some errors see logs");
            console.log({ errors });
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

export const WrestlersUpload = () => (
  <Dialog>
    <DialogTrigger>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <IconUsersPlus /> Upload Wrestlers
        </SidebarMenuButton>
      </SidebarMenuItem>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Wrestlers</DialogTitle>{" "}
        <DialogDescription>
          Upload CSV Files to mass insert wrestlers
        </DialogDescription>
      </DialogHeader>
      <Input type="file" onChange={handleFileChange} />
    </DialogContent>
  </Dialog>
);
