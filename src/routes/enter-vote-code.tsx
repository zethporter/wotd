import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/enter-vote-code')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/enter-vote-code"!</div>
}
