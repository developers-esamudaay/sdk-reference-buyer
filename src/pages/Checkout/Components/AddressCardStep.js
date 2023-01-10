import React, { Fragment, useContext, useEffect, useState } from 'react'

import styles from '../../../../src/styles/checkout/address/AddressCard.module.scss'

import { APP_COLORS } from '../../../constants/colors'


import Checkmark from '../../../assets/icons/Checkmark'
import Loading from '../../../sharedComponents/loading/Loading'

import { AddressContext } from '../../../contextProviders/addressContextProvider'
import DeliveryAddress from './DeliveryAddress'

import { isEmptyObject } from "../../../commonUtils"
import Add from '../../../assets/icons/Add'
import AddressForm from './AddressForm'
export default function AddressCardStep(props) {
  const { currentActiveStep, setCurrentActiveStep,step } = props
  const [showAddressForm,setShowAddressForm]=useState(false)

  
  const {
   
   

    selectedDeliveryAddress,
    setSelectedDeliveryAddress,
    deliveryAddresses

  } = useContext(AddressContext)

  // function to check whether step is completed or not
  function isStepCompleted() {
    if (currentActiveStep>step) {
      return true
    }
    return false
  }



  // function to check step is currently active
  function isCurrentStep() {
    if (currentActiveStep===step) {
      return true
    }
    return false
  }
  const goToNextStep=()=>{
    props.setCurrentActiveStep((prevStep)=>prevStep+1)
  }
  
  const onSelectAddress=(address)=>{
    setSelectedDeliveryAddress(address)
    goToNextStep()
    
  }
  const in_card_loading = (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
      <Loading backgroundColor={APP_COLORS.ACCENTCOLOR} />
    </div>
  )

  return (
    <div className={styles.address_card}>
   <div className={styles.address_card_header}>
    

<p className={styles.address_card_header_title}> <span className={styles.step_no_text}>1</span> Delivery Address</p>


</div>
{isCurrentStep() && (
        <Fragment>
          <div className={styles.card_body}>
           {deliveryAddresses&&deliveryAddresses.length>0&&<DeliveryAddress  onSelectAddress={onSelectAddress}  />} 
            

       
          </div>
          <div className={`${styles.card_footer} d-flex align-items-center justify-content-left`}>
            {
              showAddressForm?(<AddressForm
          
           
             
                onSelectAddress={onSelectAddress}
                selectedAddress={selectedDeliveryAddress}
                onClose={() =>
                  setShowAddressForm(false)
                }
                onSubmissionCompleted={
                  ()=>setShowAddressForm(false)
                }
              
                
              />):(       <div className="container-fluid py-2">
              <div className="row">
                <div className="col-12">
                  <div
                    className={styles.add_address_wrapper}
                    onClick={() =>
                     setShowAddressForm(true)
                    }
                    onClose={()=>setShowAddressForm(false)}
                  >
                    <Add width="15" height="15" classes={styles.add_svg_color} />
                    <div className="ps-3 flex-grow-1">
                      <p className={styles.add_address_text}>Add Address</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>)
            }
   
          </div>
        </Fragment>
      )}
         {isStepCompleted() && (
          <>
           <div className="px-3">
              <Checkmark width="25" height="16" style={{ marginBottom: '5px' }} />
            </div>
            <div className="py-2 px-5">
              <p
                className={styles.address_type_label}
                style={{ fontSize: '14px', fontWeight: 'normal' }}
              >
                Delivering to:
              </p>
              <p className={styles.address_name_and_phone}>{selectedDeliveryAddress?.name}</p>
              <p className={`${styles.address_line_2} pb-2`}>
                {selectedDeliveryAddress?.email} - {selectedDeliveryAddress?.phone}
              </p>
              <p className={styles.address_line_1}>
                {selectedDeliveryAddress?.street
                  ? selectedDeliveryAddress.street
                  : selectedDeliveryAddress?.door}
                , {selectedDeliveryAddress?.city} {selectedDeliveryAddress?.state}
              </p>
              <p className={styles.address_line_2}>{selectedDeliveryAddress?.areaCode}</p>
            </div>
            
          </>
        )}
   
    </div>
  )
}
