import { describe, it, expect, vi, beforeEach } from "vitest"
import { agentService } from "@/services/api"
import { mockAgent } from "../utils"

describe("agentService", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("getAll", () => {
    it("fetches all agents successfully", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockAgent]),
      } as Response)

      const result = await agentService.getAll()
      expect(result).toEqual([mockAgent])
    })

    it("handles fetch error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.getAll()).rejects.toThrow("Failed to fetch agents")
    })
  })

  describe("create", () => {
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

    it("handles create error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.create(mockAgent)).rejects.toThrow("Failed to create agent")
    })
  })

  describe("update", () => {
    it("updates agent successfully", async () => {
      const updatedAgent = { ...mockAgent, name: "Updated Name" }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedAgent),
      } as Response)

      const result = await agentService.update(mockAgent.id, updatedAgent)
      expect(result).toEqual(updatedAgent)
    })

    it("handles update error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.update(mockAgent.id, mockAgent)).rejects.toThrow("Failed to update agent")
    })
  })

  describe("delete", () => {
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

    it("handles delete error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      await expect(agentService.delete(mockAgent.id)).rejects.toThrow("Failed to delete agent")
    })
  })
})

