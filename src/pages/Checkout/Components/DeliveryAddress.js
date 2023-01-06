import React, { Fragment, useContext, useState } from 'react'
// import axios from 'axios'
import { address_types } from '../../../constants/addressTypes'
import { AddressContext } from '../../../contextProviders/addressContextProvider'
import styles from '../../../../src/styles/cart/cartView.module.scss'
import Add from '../../../assets/icons/Add'
// import AddAddressModal from '../../add-address-modal/addAddressModal'
import AddressRadioButton from './AddressRadioButton'
import AddAddressModal from './AddAddressModal'

// import { AddCookie } from '../../../../../utils/cookies'
// import { restoreToDefault } from '../../add-address-modal/utils/restoreDefaultAddress'
// import { ToastContext } from '../../../../../context/toastContext'
// import useCancellablePromise from '../../../../../api/cancelRequest'
// import { toast_actions, toast_types } from '../../../../shared/toast/utils/toast'

export default function DeliveryAddress(props) {
  const { selectedDeliveryAddress, setSelectedDeliveryAddress, deliveryAddresses } =
    useContext(AddressContext)
  
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: '',
    toggle: false,
    // address: restoreToDefault(),
  })

  //   const dispatch = useContext(ToastContext)

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

  // use this function to fetch lat and long from eloc
  //   async function fetchLatLongFromEloc(eloc) {
  //     try {
  //       const { data } = await cancellablePromise(
  //         axios.get(`${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_place_info?eloc=${eloc}`),
  //       )
  //       const { latitude, longitude } = data
  //       if (latitude && longitude) {
  //         AddCookie('LatLongInfo', JSON.stringify({ latitude, longitude }))
  //       } else {
  //         dispatch({
  //           type: toast_actions.ADD_TOAST,
  //           payload: {
  //             id: Math.floor(Math.random() * 100),
  //             type: toast_types.error,
  //             message:
  //               'Cannot get latitude and longitude info for this pincode Please update the Address',
  //           },
  //         })
  //         setDeliveryAddress({})
  //       }
  //     } catch (err) {
  //       dispatch({
  //         type: toast_actions.ADD_TOAST,
  //         payload: {
  //           id: Math.floor(Math.random() * 100),
  //           type: toast_types.error,
  //           message: err?.message,
  //         },
  //       })
  //     }
  //   }

  return (
    <Fragment>
      {/* delivery address list card */}
      <p className={`${styles.address_type_label} py-2`}>Delivery Address</p>
      {/* delivery address list card */}
      {deliveryAddresses && deliveryAddresses.length > 0 && (
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
                  <div className="col-lg-6" key={id}>
                    <AddressRadioButton
                      iseditable={false}
                      key={id}
                      checked={selectedDeliveryAddress?.id === id}
                      onClick={() => {
                        setSelectedDeliveryAddress(delivery_address)
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
          address_type={address_types.delivery}
          selectedAddress={toggleAddressModal.address}
          onClose={() =>
            setToggleAddressModal({
              actionType: '',
              toggle: false,
              //   address: restoreToDefault(),
            })
          }
          onAddAddress={(address) => {
            setToggleAddressModal({
              actionType: '',
              toggle: false,
              //   address: restoreToDefault(),
            })
          }}
          //   onUpdateAddress={(address) => {

          //     const updatedAddress = deliveryAddresses.map((d) => {
          //       if (d.id === address.id) {
          //         return address
          //       }
          //       return d
          //     })
          //     setDeliveryAddresses(updatedAddress)
          //     setToggleAddressModal({
          //       actionType: '',
          //       toggle: false,
          //       address: restoreToDefault(),
          //     })
          //   }
          // }
        />
      )}
    </Fragment>
  )
}
