export interface Agent {
  id: string
  name: string
  unitId: string
  jobRole: string
  instructions: string
  profileIcon?: string
}

export type AgentFormData = Omit<Agent, "id">

