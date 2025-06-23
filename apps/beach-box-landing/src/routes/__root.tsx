import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
})