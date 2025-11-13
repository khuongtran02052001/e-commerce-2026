import { createQueryClient } from '@/lib/ssr-query-client'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'

export function createHydratedPage(
  prefetch: (queryClient: QueryClient) => Promise<void>,
  PageComponent: React.FC,
) {
  return async function HydratedPage() {
    const queryClient = createQueryClient()
    await prefetch(queryClient)
    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <PageComponent />
      </HydrationBoundary>
    )
  }
}
