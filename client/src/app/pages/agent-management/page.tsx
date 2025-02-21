"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus } from "lucide-react"
import { Toaster } from "sonner"
import { showToast } from "@/components/ui/toast"
import { AgentSkeleton } from "@/components/skeletons/agent-skeleton"
import { AgentList } from "@/components/agents/agent-list"
import { AgentForm } from "@/components/agents/agent-form"
import { ConfirmDialog } from "@/components/ui/alert-confirm-dialog"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { agentService } from "@/services/api"
import type { Agent, AgentFormData } from "@/types/agent"

const queryClient = new QueryClient()

const AGENTS_PER_PAGE = 20

const initialFormState: AgentFormData = {
  name: "",
  unitId: "",
  jobRole: "",
  instructions: "",
  profileIcon: "",
}

export default function AgentManagementPage() {
  const [formData, setFormData] = useState<AgentFormData>(initialFormState)
  const [editingAgent, setEditingAgent] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJobRole, setFilterJobRole] = useState("All Roles")
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; agentId: string | null }>({
    isOpen: false,
    agentId: null,
  })

  const agentsQuery = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: agentService.getAll,
    refetchIntervalInBackground: true,
  })
  
  const { data: agents = [], isLoading, isError } = agentsQuery

  const createMutation = useMutation({
    mutationFn: agentService.create,
    onSuccess: () => {
      agentsQuery.refetch()
      showToast.success({
        message: "Agent created successfully",
        description: "The new agent has been added to the system.",
      })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      setFormData(initialFormState)
    },
    onError: () =>
      showToast.error({
        message: "Failed to create agent",
        description: "There was an error creating the agent. Please try again.",
      }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Agent) => agentService.update(id, data),
    onSuccess: () => {
      agentsQuery.refetch()
      showToast.success({
        message: "Agent updated successfully",
        description: "The agent information has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      setFormData(initialFormState)
      setEditingAgent(null)
    },
    onError: () =>
      showToast.error({
        message: "Failed to update agent",
        description: "There was an error updating the agent. Please try again.",
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: agentService.delete,
    onSuccess: () => {
      agentsQuery.refetch()
      showToast.success({
        message: "Agent deleted successfully",
        description: "The agent has been removed from the system.",
      })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      setDeleteDialog({ isOpen: false, agentId: null })
    },
    onError: () =>
      showToast.error({
        message: "Failed to delete agent",
        description: "There was an error deleting the agent. Please try again.",
      }),
  })

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterJobRole === "All Roles" || agent.jobRole === filterJobRole),
  )

  const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE)
  const paginatedAgents = filteredAgents.slice((currentPage - 1) * AGENTS_PER_PAGE, currentPage * AGENTS_PER_PAGE)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingAgent) {
        await updateMutation.mutateAsync({ ...formData, id: editingAgent })
      } else {
        await createMutation.mutateAsync(formData)
      }
    } catch (error) {
      showToast.error({
        message: "Operation failed",
        description: "An unexpected error occurred. Please try again.",
      })
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent.id)
    setFormData({
      name: agent.name,
      unitId: agent.unitId,
      jobRole: agent.jobRole,
      instructions: agent.instructions,
      profileIcon: agent.profileIcon || "",
    })
  }

  const handleDelete = (agentId: string) => {
    setDeleteDialog({ isOpen: true, agentId })
  }

  const confirmDelete = async () => {
    if (deleteDialog.agentId) {
      await deleteMutation.mutateAsync(deleteDialog.agentId)
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold tracking-tight p-4 rounded-lg">Agent Management</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">{agents.length} Agents</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registered Agents */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Registered Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={filterJobRole} onValueChange={setFilterJobRole}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Job Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Roles">All Roles</SelectItem>
                        {Array.from(new Set(agents.map((a) => a.jobRole))).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="h-[500px] pr-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <AgentSkeleton key={i} />
                        ))}
                      </div>
                    ) : isError ? (
                      <div className="text-center py-12 text-destructive">Failed to load agents</div>
                    ) : (
                      <AgentList
                        agents={paginatedAgents}
                        editingAgent={editingAgent}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    )}
                  </ScrollArea>
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Registration */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5" />
                    {editingAgent ? "Edit Agent" : "Register New Agent"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AgentForm
                    formData={formData}
                    editingAgent={editingAgent}
                    onSubmit={handleSubmit}
                    onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                    onCancel={() => {
                      setEditingAgent(null)
                      setFormData(initialFormState)
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, agentId: null })}
          onConfirm={confirmDelete}
          title="Delete Agent"
          description="Are you sure you want to delete this agent? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />

        <ThemeToggle />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

