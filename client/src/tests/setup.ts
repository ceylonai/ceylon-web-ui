import "@testing-library/jest-dom"
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

/**
 * Extends Jest matchers with testing-library matchers.
 * This allows for more intuitive DOM assertions like `toBeInTheDocument()`.
 */
expect.extend(matchers)

/**
 * Cleans up the test environment after each test.
 * Ensures that previous test artifacts do not interfere with new tests.
 * 
 * Test Case Name: Cleanup After Each Test
 * Description: Ensures a clean testing environment after each test run.
 * Steps:
 *   1. Run a test case that modifies the DOM or has mock functions.
 *   2. Observe the DOM and mock functions being reset after execution.
 * Expected Result: The DOM and mock functions are cleared after each test.
 */
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

/**
 * Mocks the global `fetch` function.
 * This prevents actual API requests and allows tests to control fetch responses.
 * 
 * Test Case Name: Mock Global Fetch
 * Description: Ensures all fetch requests in tests use a mocked response.
 * Steps:
 *   1. Execute a test that makes a `fetch` request.
 *   2. Observe that the request does not reach an actual API.
 * Expected Result: The fetch request is intercepted and handled by the mock function.
 */
global.fetch = vi.fn()

/**
 * Mocks the FileReader API used for reading files asynchronously.
 * Simulates file uploads in a controlled test environment.
 * 
 * Test Case Name: Mock FileReader for File Uploads
 * Description: Simulates file reading operations without actual file I/O.
 * Steps:
 *   1. Use `FileReader` in a test.
 *   2. Trigger `readAsDataURL()`.
 *   3. Observe the simulated `onload` event.
 * Expected Result: `FileReader` returns a predefined base64-encoded image string.
 */
class MockFileReader {
    private _result = ""
  
    get result(): string {
      return this._result
    }
  
    set result(value: string) {
      this._result = value
      if (this.onload) {
        this.onload.call(this)
      }
    }
  
    onload: (() => void) | null = null
  
    readAsDataURL() {
      // Simulate async file reading
      setTimeout(() => {
        this.result = "data:image/png;base64,test"
      }, 0)
    }
  }
  
// @ts-ignore - we're mocking the FileReader
global.FileReader = MockFileReader

/**
 * Mocks `window.matchMedia` for testing media queries.
 * Ensures components relying on `matchMedia` (like theme toggles) behave predictably.
 * 
 * Test Case Name: Mock matchMedia for Responsive Testing
 * Description: Simulates `matchMedia` behavior to test responsive components.
 * Steps:
 *   1. Execute a test that uses `window.matchMedia`.
 *   2. Observe the mocked response returning predefined values.
 * Expected Result: `matchMedia` does not rely on actual browser behavior and returns mock values.
 */
global.window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));
