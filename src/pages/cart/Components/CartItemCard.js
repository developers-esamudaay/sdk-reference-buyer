import { useState, useContext } from "react";
import styles from "../../../styles/cart/CartItemCard.module.scss";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import Add from "../../../assets/icons/Add";
import Subtract from "../../../assets/icons/Subtract";
import DeleteIcon from "@mui/icons-material/Delete";
import { useHistory } from "react-router-dom";
const extractTimeInfo = (time) => {
  let numberValue = "";
  let stringValue;
  for (let i = 0; i < time?.length ?? 0; i++) {
    if (time[i] === "P" || time[i] === "T") {
      continue;
    } else if (time[i] >= "0" && time[i] <= "9") {
      numberValue = numberValue + time[i];
    }
  }
  if (time[time.length - 1] == "D") {
    stringValue = "days";
  } else if (time[time.length - 1] == "H") {
    stringValue = "hours";
  }
  return numberValue + " " + stringValue;
};
const CartItemCard = ({ item, isCartPage,updatedPrice }) => {
  const single_item_price=isCartPage? item?.product?.price / 100:updatedPrice/100;
  const total_price=single_item_price*(item?.quantity?.count)
  const { onAddProduct, onAddQuantity, onReduceQuantity, onRemoveProduct } =
    useContext(CartContext);
    const history=useHistory()
  return (
    <div className={styles.cart_item_container}>
      <div className={styles.image_container}>
        <img src={item?.product?.images[0]} className={styles.image_style} />
      </div>
      <div className={styles.item_details_container}>
        <div>
          <p className={styles.item_name_text}>{item?.product?.item_name}</p>
        </div>
        <div>
          <p className={styles.seller_text}>
            {`Seller:${item?.product?.business_name}`}
          </p>
        </div>

        <div className={styles.cart_actions}>
        {
              isCartPage &&   <div className={styles.quantity_count_wrapper}>
              <div
                className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                onClick={() => {
                  onReduceQuantity(item?.id);
                }}
              >
                <Subtract width="13" classes={styles.subtract_svg_color} />
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <p className={styles.quantity_count}>{item?.quantity?.count}</p>
              </div>
              <div
                className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                onClick={() => {
                  onAddQuantity(item?.id);
                }}
              >
                <Add width="13" height="13" classes={styles.add_svg_color} />
              </div>
            </div>
            }
        
          <div className={styles.single_item_price_container}>
            <p className={styles.price_text}>
              <span>
                <CurrencyRupeeIcon
                  style={{ color: "#3D4152", width: "17px", height: "17px" }}
                />
              </span>

              {single_item_price}
            </p>
          </div>
          {
            isCartPage&&  <p
            className={styles.remove_text}
            onClick={() => onRemoveProduct(item?.id)}
          >
            Remove
          </p>
          }
          {
            !isCartPage&&<p className={styles.quantity_text}>{`${item?.quantity?.count} Pices`}</p>
          }
        
        </div>

        <div className={styles.price_container}>
          <p className={styles.price_text}>
            <span>
              Total:
              <CurrencyRupeeIcon
                style={{ color: "#3D4152", width: "17px", height: "17px" }}
              />
            </span>

            {total_price}
          </p>
        </div>
      </div>
      {!isCartPage&&<p className={styles.edit_address_text} onClick={()=>history.push("/cart")}>Edit</p>}
      
      {/* <div className={styles.delivery_details_container}>
        <p className={styles.delivery_info_text}>{`shipped in ${extractTimeInfo(
          item?.product?.time_to_ship
        )}`}</p>
        <p className={styles.delivery_info_text}>
          {item?.product?.returnable ? "Returnable" : "Not Returnable"}
        </p>
      </div> */}
    </div>
  );
};
export default CartItemCard;
