import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <NuqsAdapter>
      <Outlet />
      </NuqsAdapter>
      <TanStackRouterDevtools />
    </>
  ),
})
