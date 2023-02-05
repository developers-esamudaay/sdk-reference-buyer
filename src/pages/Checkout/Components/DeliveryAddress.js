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
export default function DeliveryAddress(props) {
  const {
    selectedDeliveryAddress,
    setSelectedDeliveryAddress,
    deliveryAddresses,
    editBillingAddress,
  } = useContext(AddressContext);

  const [showEditAddressForm, setEditAddressForm] = useState(false);
  const handleClick=(delivery_address) => {
    console.log("clicked selecte address")
    setEditAddressForm(false);
    setSelectedDeliveryAddress(delivery_address);
  }

  const onSetDeliveryAddress = (address) => {
    return {
      id: address.id,
      name: address?.name || "",
      email: address?.email || "",
      phone: address?.phone || "",
      location: {
        address,
      },
    };
  };

  return (
    <Fragment>
      {/* delivery address list card */}

      {/* delivery address list card */}

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
                city,
                street,
                state,
                door,
                areaCode,
                id,
              } = delivery_address;
              return (
                <>
                  {showEditAddressForm && selectedDeliveryAddress?.id === id ? (
                    <AddressForm
                      address_type={address_types.delivery}
                      isEditingAddress
                      addressId={id}
                      onSelectAddress={props.onSelectAddress}
                      selectedAddress={selectedDeliveryAddress}
                      onClose={() => setEditAddressForm(false)}
                      onSubmissionCompleted={() => setEditAddressForm(false)}
                    />
                  ) : (
                    
                      <div
                        className={styles.saved_address_wrapper}
                        style={{
                          backgroundColor:
                            selectedDeliveryAddress?.id === id
                              ? "#E8FCF2"
                              : "#FFFFFF",
                        }}
                      >
                        <AddressRadioButton
                          iseditable={true}
                          key={id}
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
                              {street ? street : door}, {city} {state},{" "}
                              {areaCode}
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
