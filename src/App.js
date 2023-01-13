import styles from './styles/globalStyles.module.scss'
import AppRoutes from './routes'
import { useEffect } from 'react'

import { CartContextProvider } from './contextProviders/cartContextProvider'
import { AddressContextProvider } from './contextProviders/addressContextProvider'
import ToastMessegeProvider from './contextProviders/toastMessegeProvider'
function App() {
 
   console.log(process.env)
  return (
    <div className={styles.background}>
      <ToastMessegeProvider>
       <CartContextProvider>
        <AddressContextProvider>
          <AppRoutes />
      </AddressContextProvider>
        </CartContextProvider>
        </ToastMessegeProvider>
    </div>
  )
}

export default App
