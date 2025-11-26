import { createAccessControl } from "better-auth/plugins/access";

const manage = {
  manage: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(manage);

export const manager = ac.newRole({
  manage: ["create", "share", "update", "delete"],
});
