import React, { useContext, useState } from 'react'
// import axios from 'axios'
// import { postCall } from '../../../../api/axios'
import styles from '../../../../src/styles/checkout/address/addAddressModal.module.scss'
import { buttonTypes } from '../../../shared/button/utils'
import Button from '../../../shared/button/button'
import { ONDC_COLORS } from '../../../shared/colors'
import Input from '../../../shared/input/input'
import CrossIcon from '../../../shared/svg/cross-icon'
import { address_types } from '../../../constants/address-types'
import { getLatLngFromAddress } from '../../../data/apiCall'
// import { toast_actions, toast_types } from '../../../shared/toast/utils/toast'
// import { restoreToDefault } from './utils/restoreDefaultAddress'
// import { ToastContext } from '../../../../context/toastContext'
import ErrorMessage from '../../../shared/error-message/errorMessage'
import validator from 'validator'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
// import useCancellablePromise from '../../../../api/cancelRequest'

export default function AddAddressModal(props) {
  const { address_type, selectedAddress, onClose, onAddAddress } = props

  // STATES

  const [address, setAddress] = useState(selectedAddress)
  const { addNewDeliveryAddresses, addNewBillingAddresses } = useContext(AddressContext)
  const [addAddressLoading, setAddAddressLoading] = useState(false)
  const [error, setError] = useState({
    name_error: '',
    email_error: '',
    phone_error: '',
    areaCode_error: '',
    city_name_error: '',
    door_error: '',
    state_name_error: '',
    street_name_error: '',
  })

  //   // CONTEXT
  //   const dispatch = useContext(ToastContext)

  // HOOKS

  function checkName() {
    if (!address?.name) {
      console.log('empty name')
      setError((error) => ({
        ...error,
        name_error: 'Please enter Name',
      }))
      return false
    }
    return true
  }

  function checkEmail() {
    if (!address?.email) {
      setError((error) => ({
        ...error,
        email_error: 'Please enter Email',
      }))
      return false
    }
    if (!validator.isEmail(address?.email)) {
      setError((error) => ({
        ...error,
        email_error: 'Please enter a valid Email',
      }))
      return false
    }
    return true
  }

  function checkPhoneNumber() {
    if (!address?.phone) {
      setError((error) => ({
        ...error,
        phone_error: 'Please enter a valid phone number',
      }))
      return false
    }
    if (!validator.isMobilePhone(address?.phone, 'en-IN')) {
      setError((error) => ({
        ...error,
        phone_error: 'Please enter a valid phone number',
      }))
      return false
    }
    return true
  }

  function checkStreetName() {
    if (!address?.street) {
      setError((error) => ({
        ...error,
        street_name_error: 'Street Name cannot be empty',
      }))
      return false
    }
    return true
  }

  function checkLandMark() {
    if (!address?.door) {
      setError((error) => ({
        ...error,
        door_error: 'Landmark cannot be empty',
      }))
      return false
    }
    return true
  }

  function checkCity() {
    if (!address?.city) {
      setError((error) => ({
        ...error,
        city_name_error: 'City Name cannot be empty',
      }))
      return false
    }
    return true
  }

  function checkState() {
    if (!address?.state) {
      setError((error) => ({
        ...error,
        state_name_error: 'State Name cannot be empty',
      }))
      return false
    }
    return true
  }

  function checkPinCode() {
    if (!address?.areaCode) {
      setError((error) => ({
        ...error,
        areaCode_error: 'Area Code cannot be empty',
      }))
      return false
    }
    if (address?.areaCode?.length < 6) {
      setError((error) => ({
        ...error,
        areaCode_error: 'Please enter a valid Area Code',
      }))
      return false
    }
    return true
  }

  // add billing address
  async function handleAddBillingAddress() {
    console.log('adding address')
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkPinCode(),
    ].every(Boolean)
    if (!allChecksPassed) {
      return
    } else {
      addNewBillingAddresses({ ...address, id: Math.random() })
    }
  }

  // add delivery address
  async function handleAddDeliveryAddress() {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkPinCode(),
    ].every(Boolean)
    if (!allChecksPassed) {
      return
    } else {
      console.log('add new address')
      setAddAddressLoading(true)
      const res = await getLatLngFromAddress(address)
      const location =
        res && res.data && res.data.length > 0
          ? { lat: res.data[0]?.lat ?? 13.34, lon: res.data[0]?.lon ?? 74.79 }
          : {
              lat: 13.34,
              lon: 74.79,
            }

      setAddAddressLoading(false)

      addNewDeliveryAddresses({
        ...address,
        id: Math.random(),
        location: location,
      })
      onAddAddress()
    }
  }

  // use this function to fetch city and pincode

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>Add {address_type} Address</p>
          <div className="ms-auto">
            <CrossIcon
              width="20"
              height="20"
              color={ONDC_COLORS.SECONDARYCOLOR}
              style={{ cursor: 'pointer' }}
              onClick={onClose}
            />
          </div>
        </div>
        <div className={styles.card_body}>
          <div className={styles.address_form_wrapper}>
            <div className={'container-fluid'}>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    label_name="Name"
                    type="text"
                    placeholder="Enter Name"
                    id="name"
                    value={address?.name}
                    has_error={error.name_error}
                    onChange={(event) => {
                      const name = event.target.value
                      setAddress((address) => ({
                        ...address,
                        name: name,
                      }))
                      setError((error) => ({
                        ...error,
                        name_error: '',
                      }))
                    }}
                    onBlur={checkName}
                    required
                  />
                  <ErrorMessage>{error.name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    id="email"
                    label_name="Email"
                    value={address?.email}
                    has_error={error.email_error}
                    onChange={(event) => {
                      const name = event.target.value
                      setAddress((address) => ({
                        ...address,
                        email: name,
                      }))
                      setError((error) => ({
                        ...error,
                        email_error: '',
                      }))
                    }}
                    onBlur={checkEmail}
                    required
                  />
                  <ErrorMessage>{error.email_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    maxlength="10"
                    placeholder="Enter Phone"
                    id="phone"
                    label_name="Phone Number"
                    value={address?.phone}
                    has_error={error.phone_error}
                    onChange={(event) => {
                      const regexp = /^[0-9]+$/
                      if (!regexp.test(event.target.value) && event.target.value !== '') return
                      const name = event.target.value
                      setAddress((address) => ({
                        ...address,
                        phone: name,
                      }))
                      setError((error) => ({
                        ...error,
                        phone_error: '',
                      }))
                    }}
                    onBlur={checkPhoneNumber}
                    required
                  />
                  <ErrorMessage>{error.phone_error}</ErrorMessage>
                </div>
                <div className="col-sm-12">
                  <Input
                    label_name="Street"
                    type="text"
                    placeholder="Enter Street"
                    id="street"
                    has_error={error.street_name_error}
                    value={address?.street}
                    onChange={(event) => {
                      const name = event.target.value
                      setAddress((address) => ({
                        ...address,
                        street: name,
                      }))
                      setError((error) => ({
                        ...error,
                        street_name_error: '',
                      }))
                    }}
                    onBlur={checkStreetName}
                    required
                  />
                  <ErrorMessage>{error.street_name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter Landmark"
                    id="landmark"
                    label_name="Landmark"
                    has_error={error.door_error}
                    value={address?.door}
                    onChange={(event) => {
                      const name = event.target.value
                      setAddress((address) => ({
                        ...address,
                        door: name,
                      }))
                      setError((error) => ({
                        ...error,
                        door_error: '',
                      }))
                    }}
                    onBlur={checkLandMark}
                    required
                  />
                  <ErrorMessage>{error.door_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    pattern="\d*"
                    maxlength="6"
                    placeholder="Enter Pin code"
                    id="pin_code"
                    label_name="Pin Code"
                    value={address?.areaCode}
                    has_error={error.areaCode_error}
                    onChange={(event) => {
                      const regexp = /^[0-9]+$/
                      if (!regexp.test(event.target.value) && event.target.value !== '') return
                      const areaCode = event.target.value
                      // if the length is 6 than call the city and state fetch call
                      //   if (areaCode.length === 6) {
                      //     fetchCityAndStateOnAreacode(areaCode)
                      //   }
                      setAddress((address) => ({
                        ...address,
                        areaCode: areaCode,
                      }))
                      setError((error) => ({
                        ...error,
                        areaCode_error: '',
                      }))
                    }}
                    onBlur={checkPinCode}
                    required
                  />
                  <ErrorMessage>{error.areaCode_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter City"
                    id="city"
                    label_name="City"
                    value={address?.city}
                    has_error={error.city_name_error}
                    required
                    onChange={(event) => {
                      const city = event.target.value
                      setAddress((address) => ({
                        ...address,
                        city: city,
                      }))
                    }}
                  />
                  <ErrorMessage>{error.city_name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter State"
                    id="state"
                    label_name="State"
                    has_error={error.state_name_error}
                    value={address?.state}
                    required
                    onChange={(event) => {
                      const state = event.target.value
                      setAddress((address) => ({
                        ...address,
                        state: state,
                      }))
                    }}
                  />
                  <ErrorMessage>{error.state_name_error}</ErrorMessage>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.card_footer} d-flex align-items-center justify-content-center`}>
          <Button
            isLoading={addAddressLoading}
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Add Address"
            onClick={() => {
              if (address_type === address_types.delivery) return handleAddDeliveryAddress()
              handleAddBillingAddress()
            }}
          />
        </div>
      </div>
    </div>
  )
}
