import { RouterProvider } from 'react-router'
import { router } from './routes/AppRouter'

export default function App() {
  return <RouterProvider router={router} />
}
