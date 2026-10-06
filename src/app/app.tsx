import { StoreProvider } from './providers/store-provider'
import { AppRouter } from './providers/router-provider'
import './styles/global.css'

export function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
