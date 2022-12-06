import { useState, useEffect, useContext } from 'react'
import { getCurrentStep } from './utils'
import { checkoutSteps } from '../../constants/checkoutSteps'
import AddressDetailsCard from './Components/AddresDetailsCard'
import styles from '../../../src/styles/cart/cartView.module.scss'
import { AddressContextProvider } from '../../contextProviders/addressContextProvider'
import CartStatus from './Components/CartStatus'
const Checkout = () => {
  console.log('in checkout')
  const [currentActiveStep, setCurrentActiveStep] = useState(
    getCurrentStep(checkoutSteps.SELECT_ADDRESS),
  )
  console.log(currentActiveStep)
  return (
    <AddressContextProvider>
      <div className={styles.playground_height}>
        <div className="container">
          <div className="row py-3">
            <div className="col-12">
              <p className={styles.cart_label}>Checkout</p>
            </div>
          </div>
          <div className="row py-2">
            <div className="col-lg-12">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12 pb-3">
                    <AddressDetailsCard
                      currentActiveStep={currentActiveStep}
                      setCurrentActiveStep={(value) => setCurrentActiveStep(value)}
                    />
                    <CartStatus
                      currentActiveStep={currentActiveStep}
                      setCurrentActiveStep={(value) => setCurrentActiveStep(value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddressContextProvider>
  )
}
export default Checkout
