import React, { Fragment, useContext, useState } from 'react'
import { address_types } from '../../../constants/addressTypes'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import styles from '../../../../src/styles/cart/cartView.module.scss'
import Add from '../../../assets/icons/Add'
import AddAddressModal from './AddAddressModal'
import AddressRadioButton from './AddressRadioButton'

// import { restoreToDefault } from '../../add-address-modal/utils/restoreDefaultAddress'

export default function BillingAddress(props) {
  const {
    billingAddresses,
    selectedBillingAddress,
    setSelectedBillingAddress,
    selectedDeliveryAddress,
  } = useContext(AddressContext)
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: '',
    toggle: false,
    // address: restoreToDefault(),
  })

  return (
    <Fragment>
      {/* billing address list card */}
      <p className={`${styles.address_type_label} py-2`}>Billing Address</p>
      {/* delivery address list card */}
      {selectedDeliveryAddress && (
        <div className="container-fluid pt-2">
          <div className="row">
            <div className="col-12">
              <AddressRadioButton
                checked={selectedBillingAddress?.id === selectedDeliveryAddress?.id}
                onClick={() => {
                  setSelectedBillingAddress(selectedDeliveryAddress)
                }}
              >
                <div className="px-3">
                  <p className={styles.address_line_1}>Same as delivery address</p>
                </div>
              </AddressRadioButton>
            </div>
          </div>
        </div>
      )}
      {billingAddresses && billingAddresses?.length > 0 && (
        <div className={`${styles.address_wrapper} container-fluid`}>
          <div className="row">
            {billingAddresses
              .filter(
                (billing_address) => billing_address?.phone !== '' && billing_address?.email !== '',
              )
              .map((billing_address) => {
                const { id, name, city, state, areaCode, street, door, email, phone } =
                  billing_address
                return (
                  <div className="col-lg-6" key={id}>
                    <AddressRadioButton
                      iseditable={false}
                      key={id}
                      checked={selectedBillingAddress?.id === id}
                      onClick={() => {
                        setSelectedBillingAddress(billing_address)
                      }}
                    >
                      <div className="px-3">
                        <p className={styles.address_name_and_phone}>{name}</p>
                        <p className={`${styles.address_line_2} pb-2`}>
                          {email} - {phone}
                        </p>
                        <p className={styles.address_line_1}>
                          {street ? street : door}, {city} {state}
                        </p>
                        <p className={styles.address_line_2}>{areaCode}</p>
                      </div>
                    </AddressRadioButton>
                  </div>
                )
              })}
          </div>
        </div>
      )}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-12">
            <div
              className={styles.add_address_wrapper}
              onClick={() =>
                setToggleAddressModal({
                  actionType: 'add',
                  toggle: true,
                  //   address: restoreToDefault(),
                })
              }
            >
              <Add width="15" height="15" classes={styles.add_svg_color} />
              <div className="ps-3 flex-grow-1">
                <p className={styles.add_address_text}>Add Address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toggleAddressModal.toggle && (
        <AddAddressModal
          address_type={address_types.billing}
          selectedAddress={toggleAddressModal.address}
          onClose={() =>
            setToggleAddressModal({
              actionType: '',
              toggle: false,
            })
          }
          onAddAddress={(address) => {
            setToggleAddressModal({
              actionType: '',
              toggle: false,
            })
          }}
        />
      )}
    </Fragment>
  )
}
