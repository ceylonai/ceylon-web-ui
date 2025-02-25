import type { ReactNode } from "react"
import { render } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme/theme-provider"

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

export const mockAgent = {
  id: "1",
  name: "Test Agent",
  unitId: "UNIT-001",
  jobRole: "Developer",
  instructions: "Test instructions",
  profileIcon: "/test-icon.png",
}

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

