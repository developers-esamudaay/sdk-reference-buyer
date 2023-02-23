import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import styles from "../../../styles/cart/CartPage.module.scss";
import CartItemCard from "./CartItemCard";
import Navbar from "../../../sharedComponents/navBar/Navbar";
import empty_cart from "../../../assets/images/empty_cart.png";
const CartPage = () => {
  console.log("in cart page");
  const {
    cartData,
    setCartData,
    cartTotalPrice,
    onRemoveProduct,
    onAddQuantity,
    onReduceQuantity,
    setShowCartInfo,
  } = useContext(CartContext);
  console.log(cartData);
  const history = useHistory();
  const totalPices = cartData?.items?.reduce(
    (val, item) => val + item?.quantity?.count,
    0
  );
  return (
    <>
      <Navbar />
      <div className={styles.cart_container}>
        {cartData?.items?.length === 0 ? (
          <div className={styles.empty_cart_container}>
            <div>
              <p className={styles.empty_cart_text}>Cart Is Empty</p>
            </div>
            <div >
            <img src={empty_cart} className={styles.empty_cart_image_container} />{" "}
            </div>
            <div className={styles.checkout_button_container}>
            <button
              onClick={() => history.push("/products")}
              className={styles.go_to_products_button}
            >
              Go To Products
            </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.cart_header}>
              <p className={styles.header_text}>
                Bag{" "}
                <span>{`${cartData?.items?.length} items|${totalPices} pices`}</span>
              </p>
            </div>
            <div className="container">
              <div className="row">
                <div
                  className={`col-lg-7 col-xl-8 col-md-8 col-sm-12 col-12 `}
                >
                  {cartData?.items?.map((item) => {
                    return (
                      <div key={item?.id}>
                        <CartItemCard item={item} isCartPage />
                      </div>
                    );
                  })}
                </div>
                <div
                  className={`col-lg-3 col-xl-3 col-md-4 col-sm-12 col-12`}
                >
                  <div className={styles.price_container}>
                    <p className={styles.cart_summary_text}>Cart Summary</p>
                    <p className={styles.cart_desc_text}>
                      Shipping and additional costs are calculated once you
                      you select delivery address.
                    </p>
                    <div className={styles.total_continer}>
                      <p className={styles.total_item_text}>Total Items</p>
                      <p className={styles.total_item_text}>
                        {cartData?.items?.length}
                      </p>
                    </div>

                    <div className={styles.total_continer}>
                      <p className={styles.total_item_text}>Total Price</p>
                      <p className={styles.total_item_text}>{cartTotalPrice}</p>
                    </div>
                    <div className={styles.checkout_button_container}>
                      <button
                        className={styles.checkout_button}
                        onClick={() => history.push("/checkout")}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default CartPage;
