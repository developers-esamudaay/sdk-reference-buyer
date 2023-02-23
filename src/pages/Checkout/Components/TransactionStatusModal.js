import React, { useContext, useState } from "react";
import Button from "../../../sharedComponents/button/Button";
import { APP_COLORS } from "../../../constants/colors";
import {
  createCart,
  createOrder,
  getOrderDetails,
} from "../../../data/firbaseCalls";
import { transactionStatusValues } from "../../../constants/transactionStatus";
import styles from "../../../styles/checkout/TransactionStatusModal.module.scss";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import uuid from "react-uuid";
import { useHistory } from "react-router-dom";
import { delay } from "../../../commonUtils";
import { confirmOrderUsingSdk } from "../../../data/apiCall";
import {
  showErrorMsg,
  msgPosition,
} from "../../../contextProviders/toastMessegeProvider";
import Loading from "../../../sharedComponents/loading/Loading";
const TransactionModal = ({ goNext, goPrev }) => {
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { cartData, setCartData, totalOrderPrice } = useContext(CartContext);
  const history = useHistory();
  const initializrOrder = async () => {
    setInitializeOrderLoading(true);
    const id = uuid();

    setOrderId(id);
    try {
      await createOrder(id, cartData?.business_id);

      const orderPayload = {
        cart_id: cartData.cart_id,
        order_id: id,
        city_code: "std:080",
        payment_info: {
          uri: "https://ondc.transaction.com/payment",
          tl_method: "http/get",
          params: {
            currency: "INR",
            transaction_id: uuid(),
            transaction_status: "captured",
            amount: "" + totalOrderPrice,
          },
        },
      };
      await confirmOrderUsingSdk(orderPayload);
      await delay(3000);
      setCartData({ items: [] });
      setInitializeOrderLoading(false);
      history.push({ pathname: "/orders", state: { orderId: id } });
    } catch (e) {
      showErrorMsg({ position: msgPosition.BOTTOM_RIGHT, msg: e });
    }
  };
  return (
    <div className={styles.transaction_modal_card}>
      <div className={styles.normal_text_container}>
        <p className={styles.normal_text}>Please select a transaction Status</p>
      </div>
      <div className={styles.button_container}>
        <button className={styles.failed_button} onClick={() => goPrev()}>
          Failed
        </button>
        {initializeOrderLoading ? (
          <Loading />
        ) : (
          <button
            className={styles.success_button}
            onClick={async () => await initializrOrder()}
          >
            Success
          </button>
        )}
      </div>
    </div>
  );
};
export default TransactionModal;
