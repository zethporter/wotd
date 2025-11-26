import { createFileRoute } from "@tanstack/react-router";
import { useSession, signIn, admin } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/user-account")({
  component: RouteComponent,
});

function RouteComponent() {
  const { error, isPending, data: session } = useSession();
  if (isPending) {
    return (
      <div>
        <pre>
          {JSON.stringify(
            { error, isPending, holder: "This is a placeholder" },
            null,
            2,
          )}
        </pre>
      </div>
    );
  }
  if (!session) {
    return (
      <div>
        <Button
          onClick={() =>
            signIn.social({ provider: "google", callbackURL: "/manage" })
          }
        >
          Sign In with google
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={async () =>
          await admin.setRole({
            userId: "RHwN7O1v7PbwkBc7bJuf9lOiQP67UB7e",
            role: ["admin", "user"],
          })
        }
      >
        Add Both Roles
      </Button>
      <Button
        onClick={async () =>
          await admin.setRole({
            userId: "RHwN7O1v7PbwkBc7bJuf9lOiQP67UB7e",
            role: "admin",
          })
        }
      >
        Add Admin Role
      </Button>
      <Button
        onClick={async () =>
          await admin.setRole({
            userId: "RHwN7O1v7PbwkBc7bJuf9lOiQP67UB7e",
            role: "user",
          })
        }
      >
        Add User Role
      </Button>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
