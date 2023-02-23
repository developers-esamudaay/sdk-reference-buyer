import { DeliveryAddressInfo } from "interfaces/PayloadsInterfaces";
import React from "react";
import styles from "../../../styles/checkout/address/AddressRadioButton.module.scss";
type AddressRadioButtonProps={
  iseditable:boolean,
  key:string,
  checked:boolean,
  onEdit:()=>void,
  handleClick:()=>void,
  children:JSX.Element
}
const  AddressRadioButton:React.FC<AddressRadioButtonProps>=(props) =>{
  const { checked, iseditable = false, onEdit,handleClick,key } = props;
  return (
    <div className={styles.radio_button_wrapper} onClick={()=>handleClick()} key={key}>

        <div >
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
export default AddressRadioButton