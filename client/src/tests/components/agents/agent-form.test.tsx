import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AgentForm } from "@/components/agents/agent-form"

describe("AgentForm", () => {
  /**
   * Default properties for the AgentForm component
   */
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

  /**
   * Test Case: Renders all form fields
   * Description: Ensures that all input fields in the AgentForm are rendered.
   * Steps:
   * 1. Render the AgentForm component.
   * 2. Check for the presence of all labeled inputs.
   * Expected Result: All form fields should be present in the document.
   */
  it("renders all form fields", () => {
    render(<AgentForm {...defaultProps} />)

    expect(screen.getByLabelText(/agent name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/unit id/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job role/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/profile icon/i)).toBeInTheDocument()
  })

  /**
   * Test Case: Calls onChange when input values change
   * Description: Verifies that the onChange handler is called with the correct value.
   * Steps:
   * 1. Render the AgentForm component.
   * 2. Simulate a change in the agent name input field.
   * Expected Result: The onChange function should be called with the updated value.
   */
  it("calls onChange when input values change", () => {
    render(<AgentForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/agent name/i), {
      target: { value: "New Agent" },
    })

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      name: "New Agent",
    })
  })

  /**
   * Test Case: Handles file upload
   * Description: Ensures that a file upload event updates the profileIcon field.
   * Steps:
   * 1. Render the AgentForm component.
   * 2. Simulate a file upload for the profile icon input field.
   * 3. Verify that the onChange handler receives the expected base64 data.
   * Expected Result: The onChange function should be called with the profileIcon field updated.
   */
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

  /**
   * Test Case: Shows cancel button when editing
   * Description: Checks that the cancel button appears and functions correctly when editing.
   * Steps:
   * 1. Render the AgentForm with an editingAgent prop.
   * 2. Verify that the cancel button is in the document.
   * 3. Click the cancel button and check if onCancel is called.
   * Expected Result: The cancel button should be visible and invoke onCancel when clicked.
   */
  it("shows cancel button when editing", () => {
    render(<AgentForm {...defaultProps} editingAgent="1" />)

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()

    fireEvent.click(cancelButton)
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  /**
   * Test Case: Submits form with current values
   * Description: Ensures the form submission calls onSubmit with the provided form data.
   * Steps:
   * 1. Render the AgentForm with preset formData.
   * 2. Submit the form.
   * Expected Result: The onSubmit function should be called when the form is submitted.
   */
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