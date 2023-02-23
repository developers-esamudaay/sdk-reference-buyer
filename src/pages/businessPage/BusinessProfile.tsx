import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import styles from "../../styles/businessProfile/BusinessPage.module.scss";
import no_image_found from "../../assets/images/no_image_found.png";
import { getBusinessDetailsById, getProducts } from "../../data/firbaseCalls";
import ProductCard from "../ProductListing/Components/ProductCard";
import { useParams } from "react-router-dom";
import { QueryTypes } from "../../constants/queryTypes";
import { CartContext } from "../../contextProviders/cartContextProvider";
import { AddressContext } from "../../contextProviders/addressContextProvider";
import haversine from "haversine-distance";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Navbar from "../../sharedComponents/navBar/Navbar";
import MapView from "../../sharedComponents/mapView/MapView";
import { Location, Address } from "interfaces/AddressInterfaces";
import { Product, BusinessDetails } from "interfaces/ResponseInterfaces";
import ProductScreen from "./screen/ProductsScreen";
import AboutScreen from "./screen/AboutScreens";
import Loading from "sharedComponents/loading/Loading";
const BusinessProfile = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [sellerLocation, setSellerLocation] = useState<Location | null>(null);
  const [sellerAddress, setSellerAddress] = useState<Address | null>(null);
  const [businessDetails, setBusinessDetails] =
    useState<BusinessDetails | null>(null);

  type QuizParams = {
    id: string;
  };

  const { id } = useParams<QuizParams>();
  const { cartData } = useContext(CartContext);
  const { currentLocation } = useContext(AddressContext);
  const mapRef = useRef();
  const defaultLatLng = 0.0;
  const defaultRadius = 6666 * 1000000;
  const userLocation = {
    latitude: currentLocation?.lat ?? defaultLatLng,
    longitude: currentLocation?.lon ?? defaultLatLng,
  };

  const providerLocation = {
    latitude: sellerLocation?.lat ?? defaultLatLng,
    longitude: sellerLocation?.lon ?? defaultLatLng,
  };

  const sellerPrettyAddress =
    "" +
    sellerAddress?.door +
    ", " +
    sellerAddress?.city +
    ", " +
    sellerAddress?.state;

  const deliveryRadius = sellerLocation?.delivery_radius ?? defaultRadius;
  console.log(userLocation, sellerLocation);
  const distanceFromSelller = useMemo<number>(
    () => haversine(userLocation, providerLocation),
    [userLocation, providerLocation]
  );
  console.log(deliveryRadius,"radius");


  const inDeliveryDistance = distanceFromSelller < deliveryRadius * 1000;
  const defaultCenter = [38.9072, -77.0369];

  const position = [51.505, -0.09];
  const cartItems = cartData?.items;

  const tabScreens = [
    {
      name: "Products",
      Screen: (
        <>
          <ProductScreen
            id={businessDetails?.business_id ?? ""}
            business_name={businessDetails?.business_name ?? ""}
          />
        </>
      ),
    },
    {
      name: "About",
      Screen: (
        <>
          <AboutScreen
            providerLocation={providerLocation}
            sellerPrettyAddress={sellerPrettyAddress}
            businessDetails={businessDetails}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const businessInfo: BusinessDetails | null = await getBusinessDetailsById(
        id
      );
      console.log(businessInfo?.locations_details?.location);
      setBusinessDetails(businessInfo);
      setSellerLocation(businessInfo?.locations_details?.location ?? {});
      setSellerAddress(businessInfo?.locations_details?.address ?? null);

      setLoading(false);
    })();
  }, []);
  const screenNames = [" Products", "About"];
  const TabBar = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "10%",
      }}
    >
      {tabScreens.map(({ name }, index) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: index === selectedTabIndex ? "#dd468a" : "",
              height: "100%",
              borderRadius: "8px",
            }}
          >
            <p
              className={styles.tabbar_text}
              style={{ color: index === selectedTabIndex ? "white" : "black" }}
              onClick={() => setSelectedTabIndex(index)}
            >
              {name}
            </p>
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      <Navbar />
      {
        loading?<Loading/>:( <>
          <div className={styles.seller_page_header_wrapper}>
          <div className={styles.seller_page_header}>
            <div className={styles.image_container}>
              <img
                src={businessDetails?.businessImageUrl ?? no_image_found}
                alt={""}
                width="150"
                height="150"
                className={styles.business_image}
              />
            </div>
            <div className={styles.business_info}>
              <p className={styles.business_name}>
                {businessDetails?.business_name}
              </p>
              <div className={styles.delivery_distance}>
                <LocationOnIcon
                  style={{ width: "30px", height: "30px", color: "green" }}
                />
                <p className={styles.delivery_distance_text}>{`${(
                  distanceFromSelller / 1000
                ).toFixed()} Km`}</p>
                <div className={styles.delivery_availablity}>
                  <LocalShippingIcon
                    style={{
                      width: "30px",
                      height: "30px",
                      color: inDeliveryDistance ? "green" : "#DC3545",
                    }}
                  />
                  <p
                    className={styles.delivery_distance_text}
                    style={{ color: inDeliveryDistance ? "green" : "#DC3545" }}
                  >
                    {inDeliveryDistance ? "Deliverable" : "Not Deliverable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className={styles.seller_page_subheader_wrapper}>{TabBar}</div>
          <div>
            {tabScreens.map(({ Screen }, index) => {
              return selectedTabIndex === index ? <>{Screen} </> : null;
            })}
          </div>
          </>)
      }
     
    </>
  );
};
export default BusinessProfile;
