/*
 * Copyright 2024-Present, Syigen Ltd. and Syigen Private Limited. All rights reserved.
 */

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Briefcase, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Agent {
    id: string
    name: string
    unitId: string
    jobRole: string
    instructions: string
    profileIcon?: string
}

type AgentFormData = Omit<Agent, "id">

const initialFormState: AgentFormData = {
    name: "",
    unitId: "",
    jobRole: "",
    instructions: "",
    profileIcon: "",
}

const AGENTS_PER_PAGE = 20

export default function AgentManagement() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [formData, setFormData] = useState<AgentFormData>(initialFormState)
    const [editingAgent, setEditingAgent] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterJobRole, setFilterJobRole] = useState("All Roles")

    const filteredAgents = agents.filter(
        (agent) =>
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterJobRole === "All Roles" || agent.jobRole === filterJobRole),
    )

    const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE)
    const paginatedAgents = filteredAgents.slice((currentPage - 1) * AGENTS_PER_PAGE, currentPage * AGENTS_PER_PAGE)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingAgent) {
            setAgents(agents.map((agent) => (agent.id === editingAgent ? { ...agent, ...formData } : agent)))
            setEditingAgent(null)
        } else {
            const newAgent: Agent = {
                id: crypto.randomUUID(),
                ...formData,
            }
            setAgents([...agents, newAgent])
        }
        setFormData(initialFormState)
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
        setAgents(agents.filter((agent) => agent.id !== agentId))
        if (editingAgent === agentId) {
            setEditingAgent(null)
            setFormData(initialFormState)
        }
    }

    const handleProfileIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({ ...formData, profileIcon: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterJobRole])

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white p-4 rounded-lg">Agent Management</h1>
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
                                        // icon={<Search className="h-4 w-4" />}
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
                                <div className="space-y-4">
                                    {paginatedAgents.length === 0 ? (
                                        <div className="text-center py-12 bg-secondary/30 rounded-lg">
                                            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                            <p className="text-sm text-muted-foreground">No agents found</p>
                                        </div>
                                    ) : (
                                        paginatedAgents.map((agent) => (
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
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(agent)}
                                                                className="hover:bg-accent"
                                                                aria-label={`Edit ${agent.name}`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDelete(agent.id)}
                                                                className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                                                                data-testid={`delete-agent-${agent.id}`}
                                                                aria-label={`Delete ${agent.name}`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete {agent.name}</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{agent.instructions}</p>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="mt-4 flex justify-between items-center">
                                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Agent Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter agent name"
                                        className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unitId">Unit ID</Label>
                                    <Input
                                        id="unitId"
                                        required
                                        value={formData.unitId}
                                        onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                                        placeholder="Enter unit ID"
                                        className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jobRole">Job Role</Label>
                                    <Input
                                        id="jobRole"
                                        required
                                        value={formData.jobRole}
                                        onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                                        placeholder="Enter job role"
                                        className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instructions">Instructions</Label>
                                    <Textarea
                                        id="instructions"
                                        required
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        placeholder="Enter agent instructions"
                                        className={cn("min-h-[120px] bg-background focus:ring-2 focus:ring-primary/50")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profileIcon">Profile Icon (Optional)</Label>
                                    <Input
                                        id="profileIcon"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileIconChange}
                                        className={cn("bg-background focus:ring-2 focus:ring-primary/50")}
                                    />
                                    {formData.profileIcon && (
                                        <Avatar>
                                            <AvatarImage src={formData.profileIcon} alt="Profile Preview" />
                                            <AvatarFallback>Preview</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {editingAgent ? <Pencil className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                                        {editingAgent ? "Update Agent" : "Register Agent"}
                                    </Button>
                                    {editingAgent && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="flex-1 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={() => {
                                                setEditingAgent(null)
                                                setFormData(initialFormState)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

