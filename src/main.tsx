import {
  RouterProvider,
  createHashHistory,
  createRouter,
  useNavigate,
} from '@tanstack/react-router'
import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import reportWebVitals from './reportWebVitals.ts'

const DefaultNotFoundComponent = () => {
  const navigate = useNavigate()

  // Perform redirect on component mount
  useEffect(() => {
    navigate({ to: '/' })
  }, [navigate])

  return null
}
import './styles.css'

// Create a new router instance
const hashHistory = createHashHistory()
const router = createRouter({
  routeTree,
  history: hashHistory,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  basepath: 'gobang-re',
  defaultNotFoundComponent: DefaultNotFoundComponent,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
