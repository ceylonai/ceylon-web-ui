import "@testing-library/jest-dom"
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

// Extend expect with testing-library matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock FileReader
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