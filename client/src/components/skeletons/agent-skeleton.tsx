import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AgentSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-full" />
    </Card>
  )
}

