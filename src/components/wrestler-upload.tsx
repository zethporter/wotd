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
      <Input type="file" />
    </DialogContent>
  </Dialog>
);
