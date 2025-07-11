import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/vote-submitted')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vote-submitted"!</div>
}
