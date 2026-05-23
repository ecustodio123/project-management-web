import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { AppQueryProvider } from './providers/AppQueryProvider.tsx'
import { ThemeProvider } from './providers/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppQueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppQueryProvider>
    </ThemeProvider>
  </StrictMode>,
)
