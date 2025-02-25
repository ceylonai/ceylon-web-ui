import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AgentList } from "@/components/agents/agent-list"
import { mockAgents } from "../../utils"

describe("AgentList", () => {
  const defaultProps = {
    agents: mockAgents,
    editingAgent: null,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  it("renders all agents", () => {
    render(<AgentList {...defaultProps} />)

    mockAgents.forEach((agent) => {
      expect(screen.getByText(agent.name)).toBeInTheDocument()
      expect(screen.getByText(`Unit ID: ${agent.unitId}`)).toBeInTheDocument()
      expect(screen.getByText(agent.jobRole)).toBeInTheDocument()
    })
  })

  it("shows empty state when no agents", () => {
    render(<AgentList {...defaultProps} agents={[]} />)
    expect(screen.getByText("No agents found")).toBeInTheDocument()
  })

  it("calls onEdit when edit button is clicked", () => {
    render(<AgentList {...defaultProps} />)

    const editButtons = screen.getAllByRole("button").filter((button) => button.className.includes("hover:bg-accent"))

    fireEvent.click(editButtons[0])
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockAgents[0])
  })

  it("calls onDelete when delete button is clicked", () => {
    render(<AgentList {...defaultProps} />)

    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("text-destructive"))

    fireEvent.click(deleteButtons[0])
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockAgents[0].id)
  })

  it("highlights editing agent", () => {
    render(<AgentList {...defaultProps} editingAgent={mockAgents[0].id} />)

    const agentCards = screen.getAllByRole("article")
    
  })
})

