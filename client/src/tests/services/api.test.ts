import { describe, it, expect, vi, beforeEach } from "vitest"
import { agentService } from "@/services/api"
import { mockAgent } from "../utils"

describe("agentService", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("getAll", () => {
    /**
     * Test Case Name: Fetch All Agents Successfully
     * Test Case Description: Ensures the getAll method fetches a list of agents correctly.
     * Steps:
     *   1. Mock fetch to return a successful response with agent data.
     *   2. Call agentService.getAll().
     * Expected Result: The function should return an array of agents.
     */
    it("fetches all agents successfully", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockAgent]),
      } as Response)

      const result = await agentService.getAll()
      expect(result).toEqual([mockAgent])
    })

    /**
     * Test Case Name: Handle Fetch Error
     * Test Case Description: Ensures an error is thrown when fetching fails.
     * Steps:
     *   1. Mock fetch to return a failed response.
     *   2. Call agentService.getAll().
     * Expected Result: The function should throw an error "Failed to fetch agents".
     */
    it("handles fetch error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.getAll()).rejects.toThrow("Failed to fetch agents")
    })
  })

  describe("create", () => {
    /**
     * Test Case Name: Create Agent Successfully
     * Test Case Description: Ensures a new agent is created successfully.
     * Steps:
     *   1. Mock fetch to return a successful response with new agent data.
     *   2. Call agentService.create() with the new agent details.
     * Expected Result: The function should return the created agent with an ID.
     */
    it("creates agent successfully", async () => {
      const newAgent = {
        name: "New Agent",
        unitId: "UNIT-003",
        jobRole: "Tester",
        instructions: "Test instructions",
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "3", ...newAgent }),
      } as Response)

      const result = await agentService.create(newAgent)
      expect(result).toEqual({ id: "3", ...newAgent })
    })

    /**
     * Test Case Name: Handle Create Error
     * Test Case Description: Ensures an error is thrown when agent creation fails.
     * Steps:
     *   1. Mock fetch to return a failed response.
     *   2. Call agentService.create() with mock agent data.
     * Expected Result: The function should throw an error "Failed to create agent".
     */
    it("handles create error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.create(mockAgent)).rejects.toThrow("Failed to create agent")
    })
  })

  describe("update", () => {
    /**
     * Test Case Name: Update Agent Successfully
     * Test Case Description: Ensures an agent's details are updated successfully.
     * Steps:
     *   1. Mock fetch to return a successful response with updated agent data.
     *   2. Call agentService.update() with agent ID and new details.
     * Expected Result: The function should return the updated agent.
     */
    it("updates agent successfully", async () => {
      const updatedAgent = { ...mockAgent, name: "Updated Name" }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedAgent),
      } as Response)

      const result = await agentService.update(mockAgent.id, updatedAgent)
      expect(result).toEqual(updatedAgent)
    })

    /**
     * Test Case Name: Handle Update Error
     * Test Case Description: Ensures an error is thrown when agent update fails.
     * Steps:
     *   1. Mock fetch to return a failed response.
     *   2. Call agentService.update() with mock agent ID and data.
     * Expected Result: The function should throw an error "Failed to update agent".
     */
    it("handles update error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.update(mockAgent.id, mockAgent)).rejects.toThrow("Failed to update agent")
    })
  })

  describe("delete", () => {
    /**
     * Test Case Name: Delete Agent Successfully
     * Test Case Description: Ensures an agent is deleted successfully.
     * Steps:
     *   1. Mock fetch to return a successful response.
     *   2. Call agentService.delete() with the agent ID.
     * Expected Result: The fetch call should be made with the DELETE method and correct agent ID.
     */
    it("deletes agent successfully", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      await agentService.delete(mockAgent.id)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(mockAgent.id),
        expect.objectContaining({ method: "DELETE" }),
      )
    })

    /**
     * Test Case Name: Handle Delete Error
     * Test Case Description: Ensures an error is thrown when agent deletion fails.
     * Steps:
     *   1. Mock fetch to return a failed response.
     *   2. Call agentService.delete() with mock agent ID.
     * Expected Result: The function should throw an error "Failed to delete agent".
     */
    it("handles delete error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.delete(mockAgent.id)).rejects.toThrow("Failed to delete agent")
    })
  })
})
