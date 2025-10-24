import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/dashboard";
import { useSession, signIn } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/manage")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = useSession();
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
  return <Dashboard />;
}
