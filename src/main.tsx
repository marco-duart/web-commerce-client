import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { RegionalConfigProvider } from './contexts/regional-config-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegionalConfigProvider>
      <App />
    </RegionalConfigProvider>
  </StrictMode>,
)
