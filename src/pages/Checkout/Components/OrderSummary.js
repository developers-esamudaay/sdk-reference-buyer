import React, { useEffect, useContext, useState } from "react";

import { checkoutSteps } from "../../../constants/checkoutSteps";
import styles from "../../../../src/styles/checkout/OrderSummary.module.scss";
import { getCurrentStep } from "../utils";
import { APP_COLORS } from "../../../constants/colors";
import {
  createCart,
  getVerificationCartData,
  createOrder,
  getOrderDetails,
} from "../../../data/firbaseCalls";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import { AddressContext } from "../../../contextProviders/addressContextProvider";
import Checkmark from "../../../assets/icons/Checkmark";
import Button from "../../../sharedComponents/button/Button";
import Loading from "../../../sharedComponents/loading/Loading";
import { verfyCartUsingSdk, confirmOrderUsingSdk } from "../../../data/apiCall";


import TransactionStatusModal from "./TransactionStatusModal";
import { transactionStatusValues } from "../../../constants/transactionStatus";
import { delay } from "../../../commonUtils";
import ErrorMessage from "../../../sharedComponents/errorMessage/ErrorMessage";
import CartItemCard from "../../cart/Components/CartItemCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  showErrorMsg,
  msgPosition,
} from "../../../contextProviders/toastMessegeProvider";
import { useHistory } from "react-router-dom";
import IndianRupee from "../../../assets/icons/IndianRupee";

const OrderSummary = ({ goNext, goPrev }) => {
  const [loading, setLoading] = useState(false);
  const [cartVerificationStatus, setCartVerificationStatus] = useState("");
  const [cartVerificationError, setCartVerificationError] = useState("");
  const [chargesBreakup, setChargesBreakup] = useState([]);
  const [itemCostBreakup, setItemCostBreakup] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { cartData, setCartData,totalOrderPrice,setToltalOrderPrice } = useContext(CartContext);
  const { selectedBillingAddress, selectedDeliveryAddress } =
    useContext(AddressContext);

  console.log(chargesBreakup);
  const convertPrettyAddress = (address) =>
    `${address?.door},${address?.city},${address?.state},${address?.areaCode}`;

  
  

  const [orderItems, setOrderItems] = useState([]);

  
  const [totalAdditionalCharge, setTotalAdditionalCharge] = useState(0);
  const history = useHistory();


  useEffect(async () => {
    setLoading(true);
    console.log(selectedDeliveryAddress);
    const payload = {
      ...cartData,
      items: cartData.items.map((item) => {
        return {
          quantity: item?.quantity?.count,
          id: item?.id,
          location_id: item?.location_id,
        };
      }),
      fulfillment_type: "DA_DELIVERY",
      billing_info: {
        name: selectedDeliveryAddress?.name,
        email: selectedDeliveryAddress?.email,
        phone: selectedDeliveryAddress?.phone,
        address: {
          name: "HOME",
          door: selectedDeliveryAddress?.door,

          city: selectedDeliveryAddress?.city,
          state: selectedDeliveryAddress?.state,
          country: "India",
          area_code: selectedDeliveryAddress?.areaCode,
        },
      },
      delivery_info: {
        location: selectedDeliveryAddress?.location,
        address: {
          name: "WORK",
          door: selectedDeliveryAddress?.door,
          locality: selectedDeliveryAddress?.door,
          city: selectedDeliveryAddress?.city,
          state: selectedDeliveryAddress?.state,
          country: "India",
          area_code: selectedDeliveryAddress?.areaCode,
        },
      },
      customer_info: {
        name: selectedDeliveryAddress?.name,
        phone: selectedDeliveryAddress?.phone,
        email: selectedDeliveryAddress?.email,
      },
    };

    try {
      await createCart(payload);
      const res = await verfyCartUsingSdk(payload);

      if (res.status === 200 && res?.data?.message?.ack?.status === "ACK") {
        await delay(3000);
        const response = await getVerificationCartData(payload?.cart_id);
        const cartVerifiedData = response.data();
        console.log(cartVerifiedData);

        setCartVerificationStatus(cartVerifiedData?.status);
        setCartVerificationError(cartVerifiedData?.error);
        setChargesBreakup(
          cartVerifiedData?.cost?.breakup?.filter((val) => val.type !== "item")
        );

        setItemCostBreakup(
          cartVerifiedData?.cost?.breakup?.filter((val) => val.type === "item")
        );
        setToltalOrderPrice(
          cartVerifiedData?.cost?.breakup?.reduce(
            (acc, val) => val.price / 100 + acc,
            0
          )
        );
        setTotalAdditionalCharge(
          cartVerifiedData?.cost?.breakup
            ?.filter((item) => item?.type != "item")
            ?.reduce((acc, val) => val.price / 100 + acc, 0)
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      showErrorMsg({ position: msgPosition.BOTTOM_RIGHT, msg: err.message });
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className={styles.loading_wrapper}>
          <Loading />
        </div>
      ) : (
        <div className={styles.order_summary_card}>
          <div className={styles.order_summary_card_header}>
            <p className={styles.order_summary_card_header_title}>
              Review Order
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div
                className={`col-lg-7 col-xl-7 col-md-8 col-sm-12 col-12`}
              >
                {cartData?.items?.map((item) => {
                  console.log(itemCostBreakup);
                  console.log(
                    itemCostBreakup?.filter((i) => i?.id === item?.id)
                  );
                  const updatedPrice = itemCostBreakup?.filter(
                    (i) => i?.id === item?.id
                  )[0]?.price;
                  return (
                    <div key={item?.id}>
                      <CartItemCard item={item} updatedPrice={updatedPrice} />
                    </div>
                  );
                })}
              </div>
              <div
                className={`col-lg-4 col-xl-4 col-md-3 col-sm-12 col-12 `}
              >
                <div className={styles.price_container}>
                <div className={styles.selcted_address_wrapper}>
                  <div className={styles.address_header}>
                  <p className={styles.address_header_text}>Address</p>
                  <p className={styles.change_address_text} onClick={()=>goPrev()}>Change </p>
                  </div>
                  <p
                    className={styles.address_text}
                  >{`${selectedDeliveryAddress?.name} | ${selectedDeliveryAddress?.phone} `}</p>
                  <p className={styles.address_text}>
                    {convertPrettyAddress(selectedDeliveryAddress)}
                  </p>
                </div>
                <div className={styles.cost_description_container}>
                

                  <div className={styles.total_continer}>
                    <p className={styles.total_item_text}>Subtotal Price</p>
                    <p className={styles.total_item_price}>
                      <span>
                        {" "}
                        <CurrencyRupeeIcon
                          style={{
                            color: "#3D4152",
                            width: "17px",
                            height: "17px",
                          }}
                        />
                      </span>
                      {totalOrderPrice - totalAdditionalCharge}
                    </p>
                  </div>
                </div>
                <div className={styles.cost_description_container}>
                  {chargesBreakup?.map((charge) => {
                    return (
                      <div className={styles.total_continer}>
                        <p
                          className={styles.total_item_text}
                        >{`${charge?.title}`}</p>
                        <p className={styles.total_item_price}>
                          {" "}
                          <span>
                            {" "}
                            <CurrencyRupeeIcon
                              style={{
                                color: "#3D4152",
                                width: "17px",
                                height: "17px",
                              }}
                            />
                          </span>
                          {charge?.price / 100}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.cost_description_container}>
                  <div className={styles.total_continer}>
                    <p className={styles.total_item_text}>{"Total Price"}</p>
                    <p className={styles.total_item_price}>{totalOrderPrice}</p>
                  </div>
                </div>
                <div className={styles.place_order_button_container}>
                  <button
                    className={styles.place_order_button}
                    onClick={() => goNext()}
                  >
                    Place Order
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default OrderSummary;
