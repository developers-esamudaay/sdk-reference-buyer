import { useState, useEffect, useContext } from 'react'
import AddressCardStep from './Components/AddressCardStep'

import { AddressContextProvider } from '../../contextProviders/addressContextProvider'
import OrderSummary from './Components/OrderSummary'
const Checkout = () => {
  
  const [currentActiveStep, setCurrentActiveStep] = useState(
   1
  )

  return (
 
   
        <div className="container">
          <div className="row py-3">
            <div className="col-12">
              <p style={checkoutStyles.checkout_label}>Checkout</p>
            </div>
          </div>
          <div className="row py-2">
            <div className="col-lg-12">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 pb-3">
                    <AddressCardStep
                      currentActiveStep={currentActiveStep}
                      step={1}
                      setCurrentActiveStep={(value) => setCurrentActiveStep(value)}
                    />
                    <OrderSummary
                      currentActiveStep={currentActiveStep}
                      step={2}
                      setCurrentActiveStep={(value) => setCurrentActiveStep(value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  

  )
}
const checkoutStyles={
  checkout_label:{
    

      fontSize: "20px",
      fontWeight: "500",
      textAlign: "left",
      color: "#606161",
   
    
  }
}
export default Checkout
