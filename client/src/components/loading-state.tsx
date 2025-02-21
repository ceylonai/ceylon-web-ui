import { AgentSkeleton } from "@/components/skeletons/agent-skeleton"

export function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <AgentSkeleton key={i} />
      ))}
    </div>
  )
}

