import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, fireEvent, waitFor } from "@testing-library/react"
import AgentManagementPage from "@/app/pages/agent-management/page"
import { renderWithProviders } from "@/tests/utils"
import { mockAgents } from "@/tests/utils"
import { agentService } from "@/services/api"

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

  it("renders page title and agent count", async () => {
    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      expect(screen.getByText("Agent Management")).toBeInTheDocument()
      expect(screen.getByText(`${mockAgents.length} Agents`)).toBeInTheDocument()
    })
  })

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
      // Fill form
      fireEvent.change(screen.getByLabelText(/agent name/i), {
        target: { value: newAgent.name },
      })
      fireEvent.change(screen.getByLabelText(/unit id/i), {
        target: { value: newAgent.unitId },
      })
      fireEvent.change(screen.getByLabelText(/job role/i), {
        target: { value: newAgent.jobRole },
      })
      fireEvent.change(screen.getByLabelText(/instructions/i), {
        target: { value: newAgent.instructions },
      })

      // Submit form
      fireEvent.submit(screen.getByRole("form"))
    })

    await waitFor(() => {
      expect(agentService.create).toHaveBeenCalledWith(expect.objectContaining(newAgent))
    })
  })

  it("updates existing agent", async () => {
    const updatedName = "Updated Name"
    
    // Mock the update service call
    vi.mocked(agentService.update).mockResolvedValueOnce({ 
      ...mockAgents[0], 
      name: updatedName 
    })
    
    renderWithProviders(<AgentManagementPage />)
    
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByText(mockAgents[0].name)).toBeInTheDocument()
    })
  
    // Get all buttons and filter by the hover:bg-accent class
    const editButtons = screen.getAllByRole("button")
      .filter(button => button.className.includes("hover:bg-accent"))
    fireEvent.click(editButtons[0])
  
    // Wait for the form to appear and be populated
    const nameInput = await screen.findByLabelText(/agent name/i)
    
    // Clear the input before setting new value
    fireEvent.change(nameInput, { target: { value: "" } })
    fireEvent.change(nameInput, { target: { value: updatedName } })
  
    // Find and submit the form
    const form = screen.getByRole("form")
    fireEvent.submit(form)
  
    // Verify the service was called with correct arguments
    await waitFor(() => {
      expect(agentService.update).toHaveBeenCalledWith(
        mockAgents[0].id,
        expect.objectContaining({
          name: updatedName,
          unitId: mockAgents[0].unitId,
          jobRole: mockAgents[0].jobRole,
          instructions: mockAgents[0].instructions
        })
      )
    }, { timeout: 2000 }) // Added longer timeout just in case
  })

  it("deletes agent with confirmation", async () => {
    renderWithProviders(<AgentManagementPage />)

    await waitFor(() => {
      // Click delete button
      const deleteButtons = screen
        .getAllByRole("button")
        .filter((button) => button.className.includes("text-destructive"))
      fireEvent.click(deleteButtons[0])
    })

    await waitFor(() => {
      // Click confirm in dialog
      const confirmButton = screen.getByRole("button", { name: /delete/i })
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(agentService.delete).toHaveBeenCalledWith(mockAgents[0].id)
    })
  })

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

