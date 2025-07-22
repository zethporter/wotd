import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/upload-wrestlers")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/upload-wrestlers"!</div>;
}
