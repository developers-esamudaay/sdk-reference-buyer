import React, { Fragment, useContext, useState } from 'react'
// import axios from 'axios'
import { address_types } from '../../../constants/addressTypes'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import styles from '../../../../src/styles/checkout/address/DeliveryAddress.module.scss'
import Add from '../../../assets/icons/Add'

import AddressRadioButton from './AddressRadioButton'
import AddressForm from './AddressForm'
import { APP_COLORS } from '../../../constants/colors'
import Button from '../../../sharedComponents/button/Button'

import { isEmptyObject } from '../../../commonUtils'
export default function DeliveryAddress(props) {
  const { selectedDeliveryAddress, setSelectedDeliveryAddress, deliveryAddresses,editBillingAddress } =
    useContext(AddressContext)
  

  const [showEditAddressForm,setEditAddressForm]=useState(false)

 
 

  const onSetDeliveryAddress = (address) => {
    return {
      id: address.id,
      name: address?.name || '',
      email: address?.email || '',
      phone: address?.phone || '',
      location: {
        address,
      },
    }
  }

 

  return (
    <Fragment>
      {/* delivery address list card */}
      <p className={`${styles.address_type_label} py-2`}>Delivery Address</p>
      {/* delivery address list card */}
    
        <div className={`${styles.address_wrapper} container-fluid pt-2`}>
          <div className="row">
            {deliveryAddresses
              .filter(
                (delivery_address) =>
                  delivery_address?.phone !== '' && delivery_address?.email !== '',
              )
              .map((delivery_address) => {
                const { name, phone, email, city, street, state, door, areaCode, id } =
                  delivery_address
                return (
                  <>
                              {
                    showEditAddressForm&&selectedDeliveryAddress?.id === id?(    <AddressForm
                      address_type={address_types.delivery}
                      isEditingAddress
                      addressId={id}
                      onSelectAddress={props.onSelectAddress}
                      selectedAddress={selectedDeliveryAddress}
                      onClose={() =>
                        setEditAddressForm(false)
                      }
                      onSubmissionCompleted={
                        ()=>setEditAddressForm(false)
                      }
                    
                      
                    />):(      <div className="col-lg-6" key={id}>
                 
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <AddressRadioButton
                      iseditable={false}
                      key={id}
                      checked={selectedDeliveryAddress?.id === id}
                      onClick={() => {
                        setEditAddressForm(false)
                        setSelectedDeliveryAddress(delivery_address)
                      }}
                    >
                      <div className="px-3">
                        <p className={styles.address_name_and_phone}>{name}  {email}  {phone}</p>
                        <p className={`${styles.address_line_2} pb-2`}>
                          {email} - {phone}
                        </p>
                        <p className={styles.address_line_1}>
                          {street ? street : door}, {city} {state}, {areaCode}
                        </p>
                   
                      </div>
                    </AddressRadioButton>
                    {
                      selectedDeliveryAddress?.id === id&&  <div style={{cursor:"pointer", marginTop:"10px"}} onClick={()=>setEditAddressForm(true)}><p className={styles.edit_address}> EDIT</p></div>
                    }
                   
                    </div>
                    <div className={styles.delivery_button} >
                    {selectedDeliveryAddress?.id === id&&
                    <>
                    <div style={{paddingTop:"20px",paddingBottom:"20px"}}>
                      <Button
                      disabled={ isEmptyObject(selectedDeliveryAddress)}
                      btnBackColor={APP_COLORS.OrangeColor}
                      hoverBackColor={APP_COLORS.DARK_ORANGE_COLOR}
                      buttonTextColor={APP_COLORS.WHITE}
                      hoverTextColor={APP_COLORS.WHITE}
                      btnBorder={`1px solid ${APP_COLORS.DARK_ORANGE_COLOR}`}
                      button_text="Delivery Here"
            
                      onClick={() =>  props.onSelectAddress(delivery_address)}
                    />
                    </div>

                    </>
                    }
                    </div>
                  </div>)
                  }
                  </>
      
            
                )
              })}
          </div>
        </div>
    
   
    </Fragment>
  )
}
