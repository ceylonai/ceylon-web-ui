import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, fireEvent, waitFor } from "@testing-library/react"
import AgentManagementPage from "@/app/pages/agent-management/page"
import { renderWithProviders } from "@/tests/utils"
import { mockAgents } from "@/tests/utils"
import { agentService } from "@/services/api"

// Mocking the agent service API
vi.mock("@/services/api", () => ({
  agentService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe("AgentManagementPage", () => {
  beforeEach(() => {
    vi.mocked(agentService.getAll).mockResolvedValue(mockAgents)
  })

  /**
   * Test Case Name: Renders Page Title and Agent Count
   * Description: Ensures the page title and the number of agents are displayed correctly.
   * Steps:
   * 1. Render the AgentManagementPage component.
   * 2. Wait for the data to be loaded.
   * 3. Verify that the title and agent count are displayed.
   * Expected Result: The title "Agent Management" and agent count should be visible.
   */
  it("renders page title and agent count", async () => {
    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      expect(screen.getByText("Agent Management")).toBeInTheDocument()
      expect(screen.getByText(`${mockAgents.length} Agents`)).toBeInTheDocument()
    })
  })

  /**
   * Test Case Name: Creates New Agent
   * Description: Ensures that a new agent can be created successfully.
   * Steps:
   * 1. Mock the agent creation API call.
   * 2. Render the AgentManagementPage.
   * 3. Fill out the agent creation form.
   * 4. Submit the form.
   * 5. Verify the API was called with the correct data.
   * Expected Result: The agentService.create should be called with the new agent data.
   */
  it("creates new agent", async () => {
    const newAgent = {
      name: "New Agent",
      unitId: "UNIT-003",
      jobRole: "Tester",
      instructions: "Test instructions",
    }

    vi.mocked(agentService.create).mockResolvedValueOnce({ id: "3", ...newAgent })

    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/agent name/i), { target: { value: newAgent.name } })
      fireEvent.change(screen.getByLabelText(/unit id/i), { target: { value: newAgent.unitId } })
      fireEvent.change(screen.getByLabelText(/job role/i), { target: { value: newAgent.jobRole } })
      fireEvent.change(screen.getByLabelText(/instructions/i), { target: { value: newAgent.instructions } })
      fireEvent.submit(screen.getByRole("form"))
    })

    await waitFor(() => {
      expect(agentService.create).toHaveBeenCalledWith(expect.objectContaining(newAgent))
    })
  })

  /**
   * Test Case Name: Updates Existing Agent
   * Description: Ensures that an agent's details can be updated.
   * Steps:
   * 1. Mock the update API call.
   * 2. Render the AgentManagementPage.
   * 3. Click on the edit button.
   * 4. Change the agent name.
   * 5. Submit the form.
   * 6. Verify the API was called with the updated data.
   * Expected Result: The agentService.update should be called with the modified agent data.
   */
  it("updates existing agent", async () => {
    const updatedName = "Updated Name"
    vi.mocked(agentService.update).mockResolvedValueOnce({ ...mockAgents[0], name: updatedName })

    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      expect(screen.getByText(mockAgents[0].name)).toBeInTheDocument()
    })

    const editButtons = screen.getAllByRole("button").filter(button => button.className.includes("hover:bg-accent"))
    fireEvent.click(editButtons[0])

    const nameInput = await screen.findByLabelText(/agent name/i)
    fireEvent.change(nameInput, { target: { value: "" } })
    fireEvent.change(nameInput, { target: { value: updatedName } })

    fireEvent.submit(screen.getByRole("form"))

    await waitFor(() => {
      expect(agentService.update).toHaveBeenCalledWith(
        mockAgents[0].id,
        expect.objectContaining({ name: updatedName })
      )
    })
  })

  /**
   * Test Case Name: Deletes Agent With Confirmation
   * Description: Ensures that an agent can be deleted after confirmation.
   * Steps:
   * 1. Render the AgentManagementPage.
   * 2. Click the delete button.
   * 3. Confirm deletion.
   * 4. Verify the API was called to delete the agent.
   * Expected Result: The agentService.delete should be called with the correct agent ID.
   */
  it("deletes agent with confirmation", async () => {
    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole("button").filter(button => button.className.includes("text-destructive"))
      fireEvent.click(deleteButtons[0])
    })

    await waitFor(() => {
      const confirmButton = screen.getByRole("button", { name: /delete/i })
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(agentService.delete).toHaveBeenCalledWith(mockAgents[0].id)
    })
  })

  /**
   * Test Case Name: Filters Agents by Search
   * Description: Ensures that agents can be filtered based on search input.
   * Steps:
   * 1. Render the AgentManagementPage.
   * 2. Enter a search query.
   * 3. Verify that only the matching agent is displayed.
   * Expected Result: Only the searched agent's name should be visible.
   */
  it("filters agents by search", async () => {
    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
        target: { value: mockAgents[0].name },
      })

      expect(screen.getByText(mockAgents[0].name)).toBeInTheDocument()
      expect(screen.queryByText(mockAgents[1].name)).not.toBeInTheDocument()
    })
  })
})
