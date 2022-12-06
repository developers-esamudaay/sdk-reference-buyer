import styles from '../../../src/styles/orders/orderCard.module.scss'
import DropdownSvg from '../../shared/svg/dropdonw'
import Pending from '../../shared/svg/pending'
const OrderCard = ({ orderData, isOrderExpended, expendOrder }) => {
  console.log(isOrderExpended)
  return (
    <div
      style={{
        marginTop: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        cursor: 'pointer',
      }}
    >
      <div
        className={styles.card_wrapper}
        onClick={() => expendOrder(isOrderExpended ? '' : orderData?.id)}
      >
        <div style={{ padding: '30px' }}>
          <p className={styles.card_header_title}>{orderData?.id ? orderData?.id : 'NA'}</p>
          <p className={styles.address_type_label} style={{ fontSize: '12px' }}>
            Ordered on
            <span style={{ fontWeight: '500', padding: '0 5px' }}>{'sdsadasd'}</span>
          </p>
        </div>
        <div className="px-3" style={{ width: '20%' }}>
          <p className={styles.status_label}>Status:</p>
          <div className="pt-1">
            <div className={styles.status_chip}>
              <p className={styles.status_text}>{orderData?.statusOrder}</p>
            </div>
          </div>
        </div>
        <div className="px-5" style={{ width: '7%' }}>
          <div
            style={
              isOrderExpended
                ? {
                    transform: 'rotate(180deg)',
                    transition: 'all 0.7s',
                  }
                : { transform: 'rotate(0)', transition: 'all 0.7s' }
            }
          >
            <DropdownSvg color={'#ddd'} />
          </div>
        </div>
      </div>
      {isOrderExpended && (
        <div className={styles.card_body}>
          {orderData?.items &&
            Array.isArray(orderData?.items) &&
            orderData?.items?.map((item) => {
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
        </div>
      )}
    </div>
  )
}
export default OrderCard
