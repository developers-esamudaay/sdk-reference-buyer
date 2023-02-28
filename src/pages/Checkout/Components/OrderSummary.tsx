import React, { useEffect, useContext, useState } from "react";

import styles from "../../../../src/styles/checkout/OrderSummary.module.scss";
import { getCurrentStep } from "../utils";
import { APP_COLORS } from "../../../constants/colors";
import {
  createCart,
  getVerificationCartData,
  createOrder,
  getOrderDetails,
} from "../../../data/firbaseCalls";
import CloseIcon from "@mui/icons-material/Close";
import {
  CartVerificationError,
  CartVerifyResInterface,
  CartVerifyStatus,
  CostBreakupInterface,
} from "interfaces/ResponseInterfaces";
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
import {
  CartVerifyPayloadInterface,
  DeliveryAddressInfo,
} from "../../../interfaces/PayloadsInterfaces";
import { CheckStepProps } from "pages/Checkout/Checkout";
const OrderSummary: React.FC<CheckStepProps> = ({ goNext, goPrev }) => {
  const [loading, setLoading] = useState(false);
  const [cartVerificationStatus, setCartVerificationStatus] =
    useState<CartVerifyStatus>(CartVerifyStatus.PANDING);
  const [cartVerificationError, setCartVerificationError] =
    useState<CartVerificationError | null>(null);
  console.log(cartVerificationError, "error");
  const [chargesBreakup, setChargesBreakup] = useState<
    CostBreakupInterface[] | []
  >([]);
  const [itemCostBreakup, setItemCostBreakup] = useState<
    CostBreakupInterface[] | []
  >([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { cartData, setCartData, totalOrderPrice, setToltalOrderPrice } =
    useContext(CartContext);
  const { selectedDeliveryAddress } = useContext(AddressContext);

  console.log(chargesBreakup);
  const convertPrettyAddress = (deliveryAddress: DeliveryAddressInfo | null) =>
    `${deliveryAddress?.address?.door ?? ""},${
      deliveryAddress?.address?.city ?? ""
    },${deliveryAddress?.address?.state ?? ""},${
      deliveryAddress?.address?.areaCode ?? ""
    }`;

  const [orderItems, setOrderItems] = useState([]);

  const [totalAdditionalCharge, setTotalAdditionalCharge] = useState(0);
  const history = useHistory();
  console.log(cartVerificationError);

  useEffect(() => {
    (async () => {
      setLoading(true);

      console.log(selectedDeliveryAddress);
      const payload: CartVerifyPayloadInterface = {
        ...cartData,
        items: cartData.items.map((item) => {
          return {
            quantity: item?.quantity?.count ?? "",
            id: item?.id,
            location_id: item?.location_id ?? "",
          };
        }),
        fulfillment_type: "DA_DELIVERY",
        billing_info: {
          name: selectedDeliveryAddress?.name ?? "",
          email: selectedDeliveryAddress?.email ?? "",
          phone: selectedDeliveryAddress?.phone ?? "",
          address: selectedDeliveryAddress?.address,
        },
        delivery_info: {
          name: selectedDeliveryAddress?.name ?? "",
          email: selectedDeliveryAddress?.email ?? "",
          phone: selectedDeliveryAddress?.phone ?? "",
          location: selectedDeliveryAddress?.location,
          address: selectedDeliveryAddress?.address,
        },
        customer_info: {
          name: selectedDeliveryAddress?.name ?? "",
          phone: selectedDeliveryAddress?.phone ?? "",
          email: selectedDeliveryAddress?.email ?? "",
        },
      };

      try {
        await createCart(payload);
        const res = await verfyCartUsingSdk(payload);
        console.log(res);

        if (res?.status === 200 && res?.data?.message?.ack?.status === "ACK") {
          console.log("test");
          await delay(3000);
          console.log("test");
          const response = await getVerificationCartData(
            payload?.cart_id ?? ""
          );
          console.log(response);
          const cartVerifiedData: CartVerifyResInterface =
            response.data() as CartVerifyResInterface;
          console.log(cartVerifiedData);

          setCartVerificationStatus(cartVerifiedData?.status);
          setCartVerificationError(cartVerifiedData?.error);

          setChargesBreakup(
            cartVerifiedData?.cost?.breakup?.filter(
              (val: CostBreakupInterface) => val.type !== "item"
            )
          );

          setItemCostBreakup(
            cartVerifiedData?.cost?.breakup?.filter(
              (val) => val.type === "item"
            )
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
      } catch (err: any) {
        console.log(err);
        showErrorMsg({
          position: msgPosition.BOTTOM_RIGHT,
          msg: "something went wrong we can not proceed with this order",
        });
        setLoading(false);
        goPrev();
      }
    })();
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
          {cartVerificationStatus === CartVerifyStatus.VERIFIED ? (
            <>
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
                        <div
                          key={item?.id}
                          style={{
                            opacity:
                              cartVerificationStatus ===
                              CartVerifyStatus.VERIFIED
                                ? 1
                                : 0.5,
                          }}
                        >
                          <CartItemCard
                            item={item}
                            updatedPrice={updatedPrice}
                          />
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
                          <p
                            className={styles.change_address_text}
                            onClick={() => goPrev()}
                          >
                            Change{" "}
                          </p>
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
                          <p className={styles.total_item_text}>
                            Subtotal Price
                          </p>
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
                          <p className={styles.total_item_text}>
                            {"Total Price"}
                          </p>
                          <p className={styles.total_item_price}>
                            {totalOrderPrice}
                          </p>
                        </div>
                      </div>
                      {cartVerificationStatus == CartVerifyStatus.VERIFIED && (
                        <div className={styles.place_order_button_container}>
                          <button
                            className={styles.place_order_button}
                            onClick={() => goNext()}
                          >
                            Place Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.overlay}>
              <div className={styles.popup_card}>
                <div className={styles.cross_wrapper}>
                  <CloseIcon
                    style={{
                      color: "white",
                      height: "40px",
                      width: "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <p className={styles.cart_verify_error}>
                  {cartVerificationError
                    ? `${cartVerificationError?.code} :${cartVerificationError?.message}`
                    : "something wrong with seller partner please clear cart and place new order"}
                </p>
                <div>
                  <button
                    className={styles.clear_cart_button}
                    onClick={() => {
                      setCartData({ items: [] });
                      history.push("/products");
                    }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default OrderSummary;
