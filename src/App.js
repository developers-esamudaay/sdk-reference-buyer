import styles from './styles/globalStyles.module.scss'
import OndcRoutes from './routes'
import { useEffect } from 'react'

import { CartContextProvider } from './contextProviders/cartContextProvider'
import { AddressContextProvider } from './contextProviders/addressContextProvider'
function App() {
  console.log(process.env.REACT_APP_FIREBASE_CONFIG,"process")
 
  return (
    <div className={styles.background}>
       <CartContextProvider>
        <AddressContextProvider>
          <OndcRoutes />
      </AddressContextProvider>
        </CartContextProvider>
    </div>
  )
}

export default App
