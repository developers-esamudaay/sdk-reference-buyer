import { useState, useEffect, useContext } from 'react'




import Navbar from '../../sharedComponents/navBar/Navbar'
import tachyons from "tachyons";
import styles from "../../styles/checkout/Checkout.module.scss"
import MultiStepProgressBar from './Components/MultistepProgressBar'
import AddressCardStep from './Components/AddressCardStep'
import OrderSummary from './Components/OrderSummary'
import { AddressContext } from '../../contextProviders/addressContextProvider';
import LocationSearchModal from '../../sharedComponents/locationSearch/LocationSearchModal';

export const CheckoutSteps=[
  {
        stepNumber:1,
        name:"Address",
        Component:AddressCardStep

  },
  {
    stepNumber:2,
    name:"Order Summary",
    Component:OrderSummary

},
{
  stepNumber:3,
  name:"Pay",
  Component:<>Payment</>

}

]
const Checkout = () => {
  
  const [currentActiveStep, setCurrentActiveStep] = useState(
   1
  )
  const {showSearchLocationModal}=useContext(AddressContext)
const goNext=()=>{
  if(currentActiveStep<CheckoutSteps.length){
    setCurrentActiveStep((prev)=>prev+1)
  }
}
const goPrev=()=>{
  if(currentActiveStep>0){
    setCurrentActiveStep((prev)=>prev-1)
  }
}
  return (
    <>
    <Navbar/>
 
   
        <div className="container">
         <div className={styles.checkout_container}>
          <div className={styles.progressbar_container}>
          <MultiStepProgressBar currentActiveStep={currentActiveStep} setCurrentActiveStep={setCurrentActiveStep}/>
          </div>
          <div>
            {
              CheckoutSteps.map((step)=>{
                const ActiveStepComponent=step?.Component
                return step?.stepNumber===currentActiveStep?(<ActiveStepComponent goNext={goNext} goPrev={goPrev}/>):null
              })
            }
          </div>
           
         </div>

            
        </div>
            {showSearchLocationModal&&<LocationSearchModal/>}
        </>
  

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
