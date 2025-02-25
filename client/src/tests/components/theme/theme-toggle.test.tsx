import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * Mocking the next-themes module to control the theme state in tests.
 */
const setThemeMock = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: setThemeMock,
  }),
}));

describe("ThemeToggle", () => {
  /**
   * Test Case: Render Theme Toggle Button
   * Description: Ensures the theme toggle button is rendered in the document.
   * Steps:
   *  1. Render the `ThemeToggle` component.
   *  2. Check if a button element is present.
   * Expected Result: The button should be in the document.
   */
  it("renders theme toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  /**
   * Test Case: Toggle Theme on Click
   * Description: Ensures clicking the button toggles the theme.
   * Steps:
   *  1. Render the `ThemeToggle` component.
   *  2. Simulate a click event on the button.
   *  3. Verify that `setTheme` is called with "dark".
   * Expected Result: The theme should switch to "dark".
   */
  it("toggles theme when clicked", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});