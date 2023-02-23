import React, { useContext, useEffect, useState } from "react";
import styles from "styles/products/ProductCard.module.scss"
import no_image_found from "../../../../src/assets/images/no_image_found.png";
import Subtract from "../../../assets/icons/Subtract";
import Add from "../../../assets/icons/Add";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import { Link } from "react-router-dom";
import { Product } from "../../../interfaces/ResponseInterfaces";
import haversine from "haversine-distance";
import { AddressContext } from "../../../contextProviders/addressContextProvider";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
type ProductCardProps = {
  product: Product;
  fromScreen?: string;
};
const getShortName=(name:string)=>{
  return name.split(" ").slice(0,3).join(" ")
}
const ProductCard: React.FC<ProductCardProps> = ({ product, fromScreen }) => {
  const { cartData, onAddProduct, onAddQuantity, onReduceQuantity } =
    useContext(CartContext);
  const { currentLocation, setCurrentLocation } = useContext(AddressContext);
  const cartItems = cartData?.items;
  const {
    product_name,
    price,
    business_name: provider_name,
    imageUrl,
    item_id,
    unique_id,
    business_id: provider_id,
    location: business_location,
  } = product;
  const [quantityCount, setQuantityCount] = useState<number>(0);

  const [toggleAddToCart, setToggleAddToCart] = useState<boolean>(false);

  const defaultLatLng = 0.0;
  const defaultRadius = 6666 * 1000000;

  const userLocation = {
    latitude: currentLocation?.lat ?? defaultLatLng,
    longitude: currentLocation?.lon ?? defaultLatLng,
  };
  const providerLocation = {
    latitude: business_location?.lat ?? defaultLatLng,
    longitude: business_location?.lon ?? defaultLatLng,
  };

  const userProviderDistance = haversine(userLocation, providerLocation);

  const deliveryRadius = business_location?.delivery_radius ??0;
console.log(business_location,deliveryRadius,"userProviderDistance")

  const inDeliveryDistance = userProviderDistance < deliveryRadius * 1000;

  useEffect(() => {
    // check product is available in cart or not and set quantity value if product is in cart
    const isProductPresent = cartItems?.find(({ id }) => id === item_id);
    if (isProductPresent) {
      setToggleAddToCart(true);
      setQuantityCount(isProductPresent.quantity.count);
    } else {
      setToggleAddToCart(false);
      setQuantityCount(0);
    }
  }, [cartItems, item_id]);

  return (
    <div className={`${styles.product_card_background}`}>
      
      <div className={styles.product_img_container}>
      {!inDeliveryDistance && (
          <div className={styles.ribbon}>
            <span>Not Deliverable</span>
          </div>
        )}
        <img
          src={imageUrl ?? no_image_found}
         
          alt={product_name}
         
          className={styles.product_img}
          onError={({ currentTarget }) =>
          {
       
            currentTarget.onerror = null
            currentTarget.src=no_image_found
          }
           
            
          }
        />

        {/* products image */}
      </div>
      <div className="px-3">
        <div className={styles.product_name_and_description_wrapper}>
          <Link
            to={{
              pathname: `/products/${unique_id}`,
          
            }}
            className={styles.product_name}
            title={product_name}
          >
            <p>
            {product_name}
            
            </p>
          </Link>
          <Link
            to={{
              pathname: `/business/${provider_id}`,
          
            }}
            className={styles.ordered_from}
            title={product_name}
          >
            <p>
              
            { `from ${getShortName(provider_name)}`}
            
            </p>
          </Link>
          {/* products name */}
        

          {/* seller name */}
        </div>
        <div>
          <div className={styles.price_container}>
            <div className="pe-2">
              <CurrencyRupeeIcon
                style={{ color: "green", width: "15px", height: "15px" }}
              />
            </div>
            <p className={styles.product_price}>
              {Number(price).toFixed(2)}
            </p>
          </div>
          {/* products price */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "20px",
              paddingBottom: "10px",
            }}
          >
            {inDeliveryDistance ? (
              <>
                {" "}
                {toggleAddToCart && quantityCount > 0 ? (
                  <div className={styles.quantity_count_wrapper}>
                    <div
                      className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                      onClick={() => {
                        setQuantityCount(quantityCount - 1);
                        onReduceQuantity(item_id);
                        if (quantityCount - 1 === 0) {
                          setToggleAddToCart(false);
                          return;
                        }
                      }}
                    >
                      <Subtract
                        width="13"
                        classes={styles.subtract_svg_color}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className={styles.quantity_count}>{quantityCount}</p>
                    </div>
                    <div
                      className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                      onClick={() => {
                        setQuantityCount((quantityCount) => quantityCount + 1);
                        onAddQuantity(item_id);
                      }}
                    >
                      <Add
                        width="13"
                        height="13"
                        classes={styles.add_svg_color}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    className={styles.add_to_cart_button}
                    onClick={() => {
                      setToggleAddToCart(true);
                      setQuantityCount((quantityCount) => quantityCount + 1);
                      onAddProduct(product);
                    }}
                  >
                    <span className={styles.long_text}> Add To Cart</span>
                    <span className={styles.short_text}> Add </span>
                  </button>
                )}
              </>
            ) : (
         <></>
            )}
          </div>
     
        </div>
      </div>
    </div>
  );
};
export default ProductCard