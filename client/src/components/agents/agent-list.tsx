import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Briefcase, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Agent } from "@/types/agent"

interface AgentListProps {
  agents: Agent[]
  editingAgent: string | null
  onEdit: (agent: Agent) => void
  onDelete: (id: string) => void
}

export function AgentList({ agents, editingAgent, onEdit, onDelete }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary/30 rounded-lg">
        <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No agents found</p>
      </div>
    )
  }

  return (
    <div role="article" className="space-y-4">
      {agents.map((agent) => (
        <Card
          key={agent.id}
          className={cn(
            "p-4 border-2 transition-all duration-300 ease-in-out transform hover:shadow-md",
            editingAgent === agent.id ? "border-primary" : "hover:border-primary/50",
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={agent.profileIcon} alt={agent.name} />
                  <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">Unit ID: {agent.unitId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {agent.jobRole}
                </span>
                <Button variant="ghost" size="icon" onClick={() => onEdit(agent)} className="hover:bg-accent">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(agent.id)}
                  className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{agent.instructions}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

