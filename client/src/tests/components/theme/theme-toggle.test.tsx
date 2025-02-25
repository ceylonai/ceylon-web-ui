import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeToggle } from "@/components/theme/theme-toggle"

const setThemeMock = vi.fn()
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: setThemeMock,
  }),
}))

describe("ThemeToggle", () => {
  it("renders theme toggle button", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("toggles theme when clicked", () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole("button"))

    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })
})
