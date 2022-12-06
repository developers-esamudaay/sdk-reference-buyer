import React from 'react'
import styles from '../../../styles/checkout/order/OrderCompletionCard.module.scss'
import Pending from '../../../shared/svg/pending'
import IndianRupee from '../../../shared/svg/indian-rupee'
const OrderCompletionCard = ({ orderId, orderItems, orderStatus }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={styles.card_header}>
          <p className={styles.card_header_title}> Thanks for Ordering With Us</p>
          <div className={styles.card_header_subtitle}>
            <p className={styles.card_header_subtitle_text}>{`OrderId:${orderId}`}</p>
          </div>
        </div>
        <div className={styles.card_body}>
          {orderItems.map((item) => {
            return (
              <div className={styles.order_items}>
                <div className={styles.order_items_text}>
                  <p className={styles.item_name_text}>{item?.title}</p>
                  <p className={styles.item_quantity_text}>{`Qt: ${item?.quantity} item`}</p>

                  <p className={styles.item_name_text}>{`Price: ${item?.price / 100} rs`} </p>
                </div>
                <div className={styles.order_items_image}>
                  <Pending />
                  <p className={styles.item_name_text}>{item?.statusFulfillment} </p>
                </div>
              </div>
            )
          })}
          <hr />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <p className={styles.item_name_text}>{`OrderStatus: ${orderStatus}`}</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
export default OrderCompletionCard
