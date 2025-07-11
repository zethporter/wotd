import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/already-voted')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/already-voted"!</div>
}
