import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/already-voted")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AlreadyVoted />;
}

function AlreadyVoted() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="max-w-xl text-wrap text-2xl text-center font-bold">
        Looks like you already voted If this isn&apos;t correct. Please contact
        the head table.
      </div>
    </div>
  );
}
