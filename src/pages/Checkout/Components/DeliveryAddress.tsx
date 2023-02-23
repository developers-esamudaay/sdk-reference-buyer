import React, { Fragment, useContext, useState } from "react";
// import axios from 'axios'
import { address_types } from "../../../constants/addressTypes";
import { AddressContext } from "../../../contextProviders/addressContextProvider";
import styles from "../../../../src/styles/checkout/address/DeliveryAddress.module.scss";
import Add from "../../../assets/icons/Add";

import AddressRadioButton from "./AddressRadioButton";
import AddressForm from "./AddressForm";
import { APP_COLORS } from "../../../constants/colors";
import Button from "../../../sharedComponents/button/Button";

import { isEmptyObject } from "../../../commonUtils";
import { DeliveryAddressInfo } from "interfaces/PayloadsInterfaces";
type DeliveryAddressProps={
  onSelectAddress:(x:DeliveryAddressInfo)=>void
}
const DeliveryAddress:React.FC<DeliveryAddressProps>=(props) =>{
  const {
    selectedDeliveryAddress,
    setSelectedDeliveryAddress,
    deliveryAddresses,

  } = useContext(AddressContext);

  const [showEditAddressForm, setEditAddressForm] = useState<boolean>(false);
  const handleClick=(delivery_address:DeliveryAddressInfo) => {
    console.log("clicked selecte address")
    setEditAddressForm(false);
    console.log(delivery_address)
    setSelectedDeliveryAddress&&setSelectedDeliveryAddress(delivery_address);
  }

  // const onSetDeliveryAddress = (address) => {
  //   return {
  //     id: address.id,
  //     name: address?.name || "",
  //     email: address?.email || "",
  //     phone: address?.phone || "",
  //     location: {
  //       address,
  //     },
  //   };
  // };

  return (
    <Fragment>
    

      <div className={`${styles.address_wrapper} container-fluid pt-2`}>
        <div className="row">
          {deliveryAddresses
            .filter(
              (delivery_address) =>
                delivery_address?.phone !== "" && delivery_address?.email !== ""
            )
            .map((delivery_address) => {
              const {
                name,
                phone,
                email,
                address,
             
                id,
              } = delivery_address;
              return (
                <>
                  {showEditAddressForm && selectedDeliveryAddress?.id === id ? (
                    <AddressForm
                
                      isEditingAddress
                     
                      onSelectAddress={props.onSelectAddress}
                      addressId={id}
       
                      onClose={() => setEditAddressForm(false)}
                    
                    />
                  ) : (
                    
                      <div
                       
                        style={{
                          backgroundColor:
                            selectedDeliveryAddress?.id === id
                              ? "#E8FCF2"
                              : "#FFFFFF",
                              borderRadius:"20px"
                        }}
                      >
                        <AddressRadioButton
                          iseditable={true}
                          key={id??""}
                          checked={selectedDeliveryAddress?.id === id}
                          onEdit={()=>setEditAddressForm(false)}
                          handleClick={()=>handleClick(delivery_address)}
                        >
                          <div className="px-3">
                            <p
                              className={styles.address_name_and_phone}
                            >{`${name} | ${phone}`}</p>
                            <p className={`${styles.address_line_2} pb-2`}>
                              {email} - {phone}
                            </p>
                            <p className={styles.address_line_1}>
                              {address?. door}, {address?.city} {address?.state},{" "}
                              {address?.areaCode}
                            </p>
                          </div>
                        </AddressRadioButton>

                     
                      </div>
          
                  )}
                </>
              );
            })}
        </div>
      </div>
    </Fragment>
  );
}
export default DeliveryAddress