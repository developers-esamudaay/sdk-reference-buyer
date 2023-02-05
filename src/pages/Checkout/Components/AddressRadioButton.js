import React from "react";
import styles from "../../../styles/checkout/address/AddressRadioButton.module.scss";
export default function AddressRadioButton(props) {
  const { checked, oneditaddress, iseditable = false, onEdit,handleClick } = props;
  return (
    <div className={styles.radio_button_wrapper} onClick={()=>handleClick()}>

        <div className={styles.box_basis}>
          <div className={styles.radio_button_background}>
            <div className={checked ? styles.active : styles.non_active}></div>
          </div>
        </div>
        <div className={styles.name_basis}>{props.children}</div>
        <div
          style={{ cursor: "pointer", marginTop: "10px" }}
          onClick={() => onEdit()}
        >
          <p className={styles.edit_address_text}> EDIT</p>
        </div>

    </div>
  );
}
