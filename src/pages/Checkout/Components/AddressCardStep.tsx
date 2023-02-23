import React, { Fragment, useContext, useEffect, useState } from "react";

import styles from "../../../../src/styles/checkout/address/AddressCard.module.scss";

import { APP_COLORS } from "../../../constants/colors";

import Checkmark from "../../../assets/icons/Checkmark";
import Loading from "../../../sharedComponents/loading/Loading";

import { AddressContext } from "../../../contextProviders/addressContextProvider";
import DeliveryAddress from "./DeliveryAddress";

import { isEmptyObject } from "../../../commonUtils";
import Add from "../../../assets/icons/Add";
import AddressForm from "./AddressForm";
import HomeIcon from "@mui/icons-material/Home";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import CloseIcon from '@mui/icons-material/Close';
import {CheckStepProps} from "pages/Checkout/Checkout"
import { DeliveryAddressInfo } from "interfaces/PayloadsInterfaces";
const  AddressCardStep:React.FC<CheckStepProps>=( { goNext, goPrev })=> {

  const [showAddressForm, setShowAddressForm] = useState(false);
  const {
    cartData,
    setCartData,
    cartTotalPrice,
    onRemoveProduct,
    onAddQuantity,
    onReduceQuantity,
    setShowCartInfo,
  } = useContext(CartContext);

  const {
    selectedDeliveryAddress,
    setSelectedDeliveryAddress,
    deliveryAddresses,
  } = useContext(AddressContext);

  const onSelectAddress = (address:DeliveryAddressInfo) => {
    setSelectedDeliveryAddress&&setSelectedDeliveryAddress(address);
    goNext();
  };

  return (
    <div className={styles.address_card}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-xl-8 col-md-8 col-sm-12 col-12">
            <div className={styles.address_card_header}>
              <p className={styles.address_card_header_title}>
                {" "}
                Delivery Addresses
              </p>
            </div>
            <div
              className={styles.add_address_wrapper}
              onClick={() => setShowAddressForm(true)}
             
            >
              <HomeIcon style={{ width: "24px", height: "24px" }} />
              <div className="ps-3 flex-grow-1">
                <p className={styles.add_address_text}>Add New Address</p>
              </div>
            </div>
            <div className={styles.saved_address_header}></div>
            {showAddressForm ? (
              <AddressForm
                onSelectAddress={onSelectAddress}
               
                onClose={() => setShowAddressForm(false)}
              />
            ) : (
              <>
                {" "}
                <p className={styles.address_card_header_title}>
                  {" "}
                  Saved Addresses
                </p>
                {deliveryAddresses && deliveryAddresses.length > 0 && (
                  <DeliveryAddress onSelectAddress={onSelectAddress} />
                )}{" "}
              </>
            )}
          </div>
          <div
            className={`col-lg-4 col-xl-3 col-md-3 col-sm-12 col-12 `}
          >
            <div className={styles.price_container}>
            <p className={styles.cart_summary_text}>Cart Summary</p>
            <p className={styles.cart_desc_text}>
              Shipping and additional costs are calculated once you checkout.
            </p>
            <div className={styles.cart_items_summary}>
            
                      {
                        cartData?.items.map((item)=>(
                          <div className={styles.item_container}>
                       
                          <p className={styles.item_text}>{item?.product_name} <span><CloseIcon/></span> <span>{item?.quantity?.count}</span></p>
                          <p className={styles.item_text}>
                           {item?.price*item?.quantity?.count}
                          </p>
                        </div>
                        ))
                      }
                      </div>
                   
                  

            <div className={styles.total_continer}>
              <p className={styles.total_item_text}>Total Price</p>
              <p className={styles.total_item_text}>{cartTotalPrice}</p>
            </div>
            {!selectedDeliveryAddress || !showAddressForm && (
              <div className={styles.continue_button_container}>
                <button
                  className={styles.continue_button}
                  onClick={() => goNext()}
                >
                  Continue
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddressCardStep