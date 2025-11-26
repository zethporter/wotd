import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/dashboard";
import { useSession, signIn, admin } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/manage")({
  component: RouteComponent,
});

async function RouteComponent() {
  const { isPending, data: session } = useSession();
  if (isPending && !session) {
    return <div>loading...</div>;
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

  if (session.user.role && session.user.role.includes("admin")) {
    return <Dashboard />;
  }
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-10">
      <h1 className="font-bold text-2xl text-primary">Missing Permissions</h1>
      <p className="font-light text-accent-foreground">
        Please contact your admin to get permissions
      </p>
    </div>
  );
  // return <pre>{JSON.stringify({ session, data, error }, null, 2)}</pre>;
}
