import React, { Fragment, useContext, useEffect, useState } from 'react'
import { buttonTypes } from '../../../shared/button/utils'
import styles from '../../../../src/styles/cart/cartView.module.scss'
import Button from '../../../shared/button/button'
import { ONDC_COLORS } from '../../../shared/colors'
import { checkoutSteps } from '../../../constants/checkoutSteps'
import { getCurrentStep } from '../utils'
import Checkmark from '../../../shared/svg/checkmark'
import Loading from '../../../shared/loading/loading'

import { AddressContext } from '../../../contextProviders/addressContextProvider'
import DeliveryAddress from './DeliveryAddress'
import BillingAddress from './BillingAddress'
import { isEmptyObject } from 'jquery'

export default function AddressDetailsCard(props) {
  const { currentActiveStep, setCurrentActiveStep } = props

  // CONTEXT
  const {
    addNewBillingAddresses,
    addNewDeliveryAddresses,
    selectedBillingAddress,
    selectedDeliveryAddress,
  } = useContext(AddressContext)
console.log(selectedBillingAddress,selectedDeliveryAddress)
  // function to check whether step is completed or not
  function isStepCompleted() {
    if (currentActiveStep.current_active_step_number > 1) {
      return true
    }
    return false
  }

  // function to check whether to show the change button or not
  function toggleChangeButton() {
    if (currentActiveStep.current_active_step_number < 3) {
      return true
    }
    return false
  }

  // function to get the current active step
  function isCurrentStep() {
    if (currentActiveStep.current_active_step_id === checkoutSteps.SELECT_ADDRESS) {
      return true
    }
    return false
  }

  const in_card_loading = (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  )

  return (
    <div className={styles.price_summary_card}>
      <div
        className={`${isStepCompleted() ? styles.step_completed_card_header : styles.card_header}`}
        style={
          isCurrentStep()
            ? {
                borderBottom: `1px solid ${ONDC_COLORS.BACKGROUNDCOLOR}`,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }
            : {
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }
        }
      >
        <div className="d-flex align-items-center">
          <p className={styles.card_header_title}>Address</p>
          {isStepCompleted() && (
            <div className="px-3">
              <Checkmark width="25" height="16" style={{ marginBottom: '5px' }} />
            </div>
          )}
        </div>
        {isStepCompleted() && (
          <>
            <div className="py-2">
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
            <div className="py-2">
              <p
                className={styles.address_type_label}
                style={{ fontSize: '14px', fontWeight: 'normal' }}
              >
                Billing Address:
              </p>
              {selectedBillingAddress.id !== selectedDeliveryAddress.id ? (
                <>
                  {' '}
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
                </>
              ) : (
                <p>Same with Delivery Address</p>
              )}
            </div>
          </>
        )}
      </div>
      {isCurrentStep() && (
        <Fragment>
          <div className={styles.card_body}>
            <DeliveryAddress />

            <hr style={{ background: ONDC_COLORS.SECONDARYCOLOR }} />

            <BillingAddress />
          </div>
          <div className={`${styles.card_footer} d-flex align-items-center justify-content-center`}>
            <Button
              disabled={isEmptyObject(selectedBillingAddress) || isEmptyObject(selectedDeliveryAddress)}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Proceed"
              onClick={() => setCurrentActiveStep(getCurrentStep(checkoutSteps.CART_STATUS))}
            />
          </div>
        </Fragment>
      )}
    </div>
  )
}
