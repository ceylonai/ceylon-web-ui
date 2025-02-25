import type { ReactNode } from "react"
import { render } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme/theme-provider"

/**
 * Creates a new instance of QueryClient with predefined settings.
 *
 * Test Case Name: Create Query Client
 * Description: Ensures that a QueryClient instance is created with proper configurations.
 * Steps:
 *   1. Call `createQueryClient()` to initialize a QueryClient instance.
 *   2. Observe the configurations such as retry behavior, stale time, and refetch options.
 * Expected Result: The function returns a properly configured QueryClient instance.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

/**
 * Renders a component with the necessary providers including QueryClientProvider and ThemeProvider.
 *
 * Test Case Name: Render with Providers
 * Description: Ensures that components are wrapped with required providers for testing.
 * Steps:
 *   1. Call `renderWithProviders(ui)` with a React component.
 *   2. Verify that the component renders within ThemeProvider and QueryClientProvider.
 * Expected Result: The component is successfully rendered within the necessary providers.
 */
export function renderWithProviders(ui: ReactNode) {
  const queryClient = createQueryClient()
  return {
    ...render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </ThemeProvider>,
    ),
    queryClient,
  }
}

/**
 * Mock agent object used for testing API calls and UI components.
 *
 * Test Case Name: Mock Agent Object
 * Description: Provides a predefined mock agent for testing purposes.
 * Steps:
 *   1. Access the `mockAgent` object in tests.
 *   2. Verify its properties such as id, name, and job role.
 * Expected Result: The mockAgent object contains the expected fields and values.
 */
export const mockAgent = {
  id: "1",
  name: "Test Agent",
  unitId: "UNIT-001",
  jobRole: "Developer",
  instructions: "Test instructions",
  profileIcon: "/test-icon.png",
}

/**
 * Mock list of agents used for testing multiple data scenarios.
 *
 * Test Case Name: Mock Agent List
 * Description: Provides a list of predefined agents for testing components that handle multiple items.
 * Steps:
 *   1. Access the `mockAgents` array in tests.
 *   2. Verify the list contains multiple agent objects with valid data.
 * Expected Result: The mockAgents array includes multiple agent objects with correct attributes.
 */
export const mockAgents = [
  mockAgent,
  {
    id: "2",
    name: "Another Agent",
    unitId: "UNIT-002",
    jobRole: "Designer",
    instructions: "More instructions",
  },
]
