import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AgentList } from "@/components/agents/agent-list"
import { mockAgents } from "../../utils"

/**
 * Test suite for the AgentList component
 */
describe("AgentList", () => {
  const defaultProps = {
    agents: mockAgents,
    editingAgent: null,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  /**
   * Test case: Renders all agents in the list
   * Steps:
   * 1. Render the AgentList component with mockAgents
   * 2. Verify that each agent's name, unit ID, and job role are displayed
   * Expected Result: All agents are rendered with correct details
   */
  it("renders all agents", () => {
    render(<AgentList {...defaultProps} />)

    mockAgents.forEach((agent) => {
      expect(screen.getByText(agent.name)).toBeInTheDocument()
      expect(screen.getByText(`Unit ID: ${agent.unitId}`)).toBeInTheDocument()
      expect(screen.getByText(agent.jobRole)).toBeInTheDocument()
    })
  })

  /**
   * Test case: Displays empty state message when there are no agents
   * Steps:
   * 1. Render the AgentList component with an empty agents array
   * 2. Verify that the "No agents found" message is displayed
   * Expected Result: The empty state message is rendered
   */
  it("shows empty state when no agents", () => {
    render(<AgentList {...defaultProps} agents={[]} />)
    expect(screen.getByText("No agents found")).toBeInTheDocument()
  })

  /**
   * Test case: Calls onEdit when the edit button is clicked
   * Steps:
   * 1. Render the AgentList component
   * 2. Click the first edit button
   * 3. Verify that the onEdit function is called with the correct agent
   * Expected Result: onEdit is called with the first agent's data
   */
  it("calls onEdit when edit button is clicked", () => {
    render(<AgentList {...defaultProps} />)

    const editButtons = screen.getAllByRole("button").filter((button) => button.className.includes("hover:bg-accent"))

    fireEvent.click(editButtons[0])
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockAgents[0])
  })

  /**
   * Test case: Calls onDelete when the delete button is clicked
   * Steps:
   * 1. Render the AgentList component
   * 2. Click the first delete button
   * 3. Verify that the onDelete function is called with the correct agent ID
   * Expected Result: onDelete is called with the first agent's ID
   */
  it("calls onDelete when delete button is clicked", () => {
    render(<AgentList {...defaultProps} />)

    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("text-destructive"))

    fireEvent.click(deleteButtons[0])
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockAgents[0].id)
  })

  /**
   * Test case: Highlights the editing agent
   * Steps:
   * 1. Render the AgentList component with an editingAgent set to the first agent's ID
   * 2. Verify that the corresponding agent is visually highlighted
   * Expected Result: The editing agent should be visually distinct
   */
  it("highlights editing agent", () => {
    render(<AgentList {...defaultProps} editingAgent={mockAgents[0].id} />)

    const agentCards = screen.getAllByRole("article")
    // Further assertions can be added here if highlighting logic is implemented
  })
})