import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AgentForm } from "@/components/agents/agent-form"

describe("AgentForm", () => {
  const defaultProps = {
    formData: {
      name: "",
      unitId: "",
      jobRole: "",
      instructions: "",
      profileIcon: "",
    },
    editingAgent: null,
    onSubmit: vi.fn((e) => e.preventDefault()),
    onChange: vi.fn(),
    onCancel: vi.fn(),
  }

  it("renders all form fields", () => {
    render(<AgentForm {...defaultProps} />)

    expect(screen.getByLabelText(/agent name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/unit id/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job role/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/profile icon/i)).toBeInTheDocument()
  })

  it("calls onChange when input values change", () => {
    render(<AgentForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/agent name/i), {
      target: { value: "New Agent" },
    })

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      name: "New Agent",
    })
  })

  it("handles file upload", async () => {
    const onChange = vi.fn()
    render(<AgentForm {...defaultProps} onChange={onChange} />)

    const file = new File(["test"], "test.png", { type: "image/png" })
    const input = screen.getByLabelText(/profile icon/i)

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        profileIcon: "data:image/png;base64,test",
      })
    })
  })

  it("shows cancel button when editing", () => {
    render(<AgentForm {...defaultProps} editingAgent="1" />)

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()

    fireEvent.click(cancelButton)
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it("submits form with current values", () => {
    const formData = {
      name: "Test Agent",
      unitId: "TEST-001",
      jobRole: "Tester",
      instructions: "Test instructions",
      profileIcon: "",
    }

    render(<AgentForm {...defaultProps} formData={formData} />)

    fireEvent.submit(screen.getByRole("form"))
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })
})

