import { env } from "@/config/env"
import type { Agent, AgentFormData } from "@/types/agent"

const BASE_URL = `${env.API_URL}/api/agents`

export const agentService = {
  async getAll(): Promise<Agent[]> {
    try {
      const response = await fetch(BASE_URL)
      if (!response.ok) throw new Error("Failed to fetch agents")
      return response.json()
    } catch (error) {
      throw new Error("Failed to fetch agents")
    }
  },

  async create(data: AgentFormData): Promise<Agent> {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create agent")
      return response.json()
    } catch (error) {
      throw new Error("Failed to create agent")
    }
  },

  async update(id: string, data: AgentFormData): Promise<Agent> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update agent")
      return response.json()
    } catch (error) {
      throw new Error("Failed to update agent")
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete agent")
    } catch (error) {
      throw new Error("Failed to delete agent")
    }
  },
}

