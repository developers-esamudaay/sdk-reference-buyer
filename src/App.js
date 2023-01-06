import styles from './styles/globalStyles.module.scss'
import AppRoutes from './routes'
import { useEffect } from 'react'

import { CartContextProvider } from './contextProviders/cartContextProvider'
import { AddressContextProvider } from './contextProviders/addressContextProvider'
function App() {
 
 
  return (
    <div className={styles.background}>
       <CartContextProvider>
        <AddressContextProvider>
          <AppRoutes />
      </AddressContextProvider>
        </CartContextProvider>
    </div>
  )
}

export default App
