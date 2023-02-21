import React, { Fragment, useState, useEffect } from "react";
import styles from "../../../../src/styles/products/productDetails.module.scss";
import { Link,useParams } from "react-router-dom";

import no_image_found from "../../../../src/assets/images/no_image_found.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useContext } from "react";
import { CartContext } from "../../../contextProviders/cartContextProvider";
import Subtract from "../../../assets/icons/Subtract";
import Add from "../../../assets/icons/Add";
import ExpendedView from "../../../sharedComponents/expededView/ExpededView";
import { getProducts ,getProductDetailsById} from "../../../data/firbaseCalls";
import { ProductDetailsInterface } from "../../../interfaces/ResponseInterfaces";
import { firestoreCollections } from "../../../constants/firestoreCollections";
import Navbar from "../../../sharedComponents/navBar/Navbar";
// import CartInfo from '../../cart/Components/CartInfo'
import { AddressContext } from "../../../contextProviders/addressContextProvider";
import haversine from "haversine-distance";
import ProductIcon from "../../../assets/icons/ProductIcon";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// extract time info from time String
const extractTimeInfo = (time:string):string => {
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
const getShortName=(name:string)=>{
  return name.split(" ").slice(0,3).join(" ")
}
const  ProductDetails=()=> {


  const { id } = useParams()as{id :string} 


  const [product,setProduct]=useState<ProductDetailsInterface|null>(null)
  const [quantityCount, setQuantityCount] = useState<number>(0);
  const [toggleAddToCart, setToggleAddToCart] = useState<boolean>(false);
  const {
    cartData,
    onReduceQuantity,
    onAddQuantity,
    onAddProduct,
    showCartInfo,
    setShowCartInfo,
  } = useContext(CartContext);
  const { currentLocation } = useContext(AddressContext);
  const cartItems = cartData?.items;
  const [sameProviderProducts, setSameProviderProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const defaultLatLng = 0.0;
  const defaultRadius = 0;

  const userLocation = {
    latitude: currentLocation?.lat ?? defaultLatLng,
    longitude: currentLocation?.lon ?? defaultLatLng,
  };
  const providerLocation = {
    latitude: product?.location?.lat ?? defaultLatLng,
    longitude:product?.location?.lon ?? defaultLatLng,
  };
  console.log(userLocation,providerLocation)
  const userProviderDistance = haversine(userLocation, providerLocation);
  const deliveryRadius = product?.location?.delivery_radius ?? defaultRadius;
console.log(userProviderDistance)

  const inDeliveryDistance = userProviderDistance < deliveryRadius * 1000;
   console.log(product)
  useEffect(()=>{
    (async ()=>{
       const  productDetails:ProductDetailsInterface|null=await getProductDetailsById(id)
       console.log(productDetails)
       setProduct(productDetails)
    })()
  },[])
  useEffect(() => {
    //check if product is already in cart
    const isProductPresent = cartItems?.find(({ id }) => id === product?.id);
    if (isProductPresent) {
      setToggleAddToCart(true);
      setQuantityCount(isProductPresent.quantity.count);
    } else {
      setToggleAddToCart(false);
      setQuantityCount(0);
    }
  }, [cartItems,id]);

  return (
    <Fragment>
      <Navbar/>

      <div className={styles.product_list_without_summary_wrapper}>
        <div className={styles.top_navigation}>
          <Link to={{ pathname: "/products" }} className={styles.back_text}>
            <p>Products</p>
          </Link>
          <KeyboardArrowRightIcon style={{ color: "#3D4152" }} />
          <Link
            to={{
              pathname: `/products/${id}`,
            
            }}
            className={styles.back_text}
          >
            <p className={styles.back_text}>{getShortName(product?.item_name??"") }</p>
          </Link>
        </div>
        <div className={styles.full_container}>
          <div className="row">
            {/* navigation routes */}

            <div className="col-md-12 col-lg-6 p-3 ">
              {/* PRODUCT IMAGE  */}
              <div className={styles.left_container}>
              <div className={styles.product_img_container}>
                <Carousel axis={"horizontal"}>
                  
                 
                    {product?.images?.map((image) => {
                      return (
                   
                        <img
                          src={image}
                          alt={product?.item_name}
                          className={styles.product_img}
                        
                        />
                       
                      );
                    })}
                 
                </Carousel>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-5 p-3">
              {/* NAME AND ORDERING FROM  */}
              <div className={styles.right_container}>
                <p className={`${styles.product_name} `}>{product?.item_name}</p>
                <p className={styles.ordered_from}>
                  Seller-<span className={styles.bold}>{product?.business_name}</span>
                </p>
                <div>
                  {inDeliveryDistance ? (
                    <>
                      {" "}
                      {toggleAddToCart && quantityCount > 0 ? (
                        <div className={styles.quantity_count_wrapper}>
                          <div
                            className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                            onClick={() => {
                              setQuantityCount(quantityCount - 1);
                              onReduceQuantity(product?.id??"");
                              if (quantityCount - 1 === 0) {
                                setToggleAddToCart(false);
                                return;
                              }
                            }}
                          >
                            <Subtract
                              width="20"
                              height="20"
                              classes={styles.subtract_svg_color}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-center">
                            <p className={styles.quantity_count}>
                              {quantityCount}
                            </p>
                          </div>
                          <div
                            className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                            onClick={() => {
                              console.log("test")
                              setQuantityCount(
                                (quantityCount) => quantityCount + 1
                              );
                              onAddQuantity(product?.id??"");
                            }}
                          >
                            <Add
                              width="20"
                              height="20"
                              classes={styles.add_svg_color}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          className={styles.add_to_cart_button}
                          onClick={() => {
                            
                            setToggleAddToCart(true);
                            setQuantityCount(
                              (quantityCount) => quantityCount + 1
                            );
                            onAddProduct({
                              item_id:product?.id??"",
                              bpp_id:product?.bpp_id??"",
                              bpp_uri:product?.bpp_uri??"",
                              business_id:product?.business_id??"",
                              business_name:product?.business_name??"",
                              product_name:product?.item_name??"",
                         
                              price:product?.price??0,
                              imageUrl:product?.imageUrl??"",
                              location_id:product?.location_id??"",
                              business_location_ids:product?.business_location_ids??[],
                              city_code:product?.city_code??"",
                         
                            });
                          }}
                        >
                          Add To Cart
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={styles.no_delivery}>
                      <p className={styles.no_delivery_text}>Not Deliverable</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className={styles.product_price}>
                    ₹ {Number((product?.price??0)/100).toFixed(2)}
                  </p>
                </div>
                {/* if item is in delivery range then show add to cart button */}

                {/* ADD TO CART BUTTON  */}
                {/* DIVIDER  */}
                <div className={styles.product_info_heading}>
                  <p className={styles.product_info_text}>
                    {" "}
                    Product Information
                  </p>
                </div>

                <ExpendedView
                  header={"Product Details"}
                  shouldExpendedInitially={true}
                  Icon={PersonIcon}
                >
                  <div className={styles.width}>
                    {typeof product?.returnable !== "undefined" ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Returnable:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {product?.returnable == true ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {/* CANCELABLE  */}
                    {typeof product?.cancellable !== "undefined" ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Cancelable:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {product?.cancellable == true ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {/* COD  */}
                    {product?.cod_available  ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Cash On Delivery:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {product?.cod_available == true ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Return Window  */}

                    {product?.return_window ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Return Window:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {extractTimeInfo(product?.return_window)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {/* Shipping Time */}
                    { product?.time_to_ship  ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Time to Ship:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {extractTimeInfo(product?.time_to_ship??"")}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {/* Category */}
                    { product?.category  ? (
                      <div className={styles.product_details}>
                        <div className={styles.product_details_key}>
                          <p className={styles.prodcut_details_key_text}>
                            Category:
                          </p>
                        </div>
                        <div className={styles.product_details_value}>
                          <p className={styles.prodcut_details_value_text}>
                            {product?.category}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </ExpendedView>
                <hr style={productStyle.lineStyle} />
                <ExpendedView
                  header={"Know Your Product"}
                  shouldExpendedInitially={true}
                  Icon={InfoIcon}
                >
                  {typeof product?.short_desc !== "undefined" ? (
                    <div className="d-flex align-items-center justify-content-center py-1">
                      <p className={styles.prodcut_details_key_text}>
                        Product Description:
                      </p>
                      <p className={styles.prodcut_details_value_text}>
                        {product?.short_desc}
                      </p>
                    </div>
                  ) : null}
                </ExpendedView>
                <hr style={productStyle.lineStyle} />
                <ExpendedView
                  header={"Seller Detalis"}
                  shouldExpendedInitially={true}
                  Icon={PersonIcon}
                >
                  {typeof product?.business_name !== "undefined" ? (
                    <div className={styles.product_details}>
                      <div className={styles.product_details_key}>
                        <p className={styles.prodcut_details_key_text}>
                          Seller Name:
                        </p>
                      </div>
                      <div className={styles.product_details_value}>
                        <p className={styles.prodcut_details_value_text}>
                          {product?.business_name}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {typeof product?.bpp_id !== "undefined" ? (
                    <div className={styles.product_details}>
                      <div className={styles.product_details_key}>
                        <p className={styles.prodcut_details_key_text}>
                          Seller Details:
                        </p>
                      </div>
                      <div className={styles.product_details_value}>
                        <p className={styles.prodcut_details_value_text}>
                          {product?.bpp_id}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div className="d-flex align-items-center justify-content-center py-1">
                    <Link
                      to={{
                        pathname: `/business/${product?.business_id}`,
                      }}
                      title={product?.item_name}
                    >
                      {`visit seller page ${product?.business_name}`}
                    </Link>
                  </div>
                </ExpendedView>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {showCartInfo&&<CartInfo onClose={()=>setShowCartInfo(false)}/>} */}
    </Fragment>
  );
}
export default ProductDetails
const productStyle = {
  lineStyle: { border: "1px solid #aaa" },
};
