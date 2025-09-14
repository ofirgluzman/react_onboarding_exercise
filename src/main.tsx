import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import AllUsers from './components/AllUsers.tsx'
import UserDetails from './components/UserDetails.tsx'
import UserEditForm from './components/UserEditForm.tsx'
import { queryClient } from './lib/queryClient'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <AllUsers />,
      },
      {
        path: 'user/:id',
        element: <UserDetails />,
      },
      {
        path: 'user/:id/edit',
        element: <UserEditForm instanceId="user edit form" />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
