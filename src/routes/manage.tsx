import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/dashboard";

export const Route = createFileRoute("/manage")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
