import React from 'react'
import styles from '../../../styles/checkout/address/AddressRadioButton.module.scss'
export default function AddressRadioButton(props) {
  const { checked, oneditaddress, iseditable = false } = props
  return (
    <div className="d-flex align-items-start">
      <button className={`${styles.radio_button_wrapper} p-2 my-1`} {...props}>
        <div className={styles.box_basis}>
          <div className={styles.radio_button_background}>
            <div className={checked ? styles.active : styles.non_active}></div>
          </div>
        </div>
        <div className={styles.name_basis}>{props.children}</div>
      </button>
   
    </div>
  )
}
