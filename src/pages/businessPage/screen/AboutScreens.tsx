import React from "react";
import styles from "styles/businessProfile/BusinessPage.module.scss";
import MapView from "sharedComponents/mapView/MapView";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { BusinessDetails } from "interfaces/ResponseInterfaces";
type AboutProps = {
  providerLocation: {
    latitude: number;
    longitude: number;
  };
  sellerPrettyAddress: string;
  businessDetails: BusinessDetails | null;
};
const AboutScreen: React.FC<AboutProps> = ({
  providerLocation,
  sellerPrettyAddress,
  businessDetails,
}) => (
  <div className={styles.about_container}>
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-xl-5 col-md-6 col-sm-12">
          <p className={styles.about_heading_text}>Map</p>
          {/* <MapView
              location={{
                lat: providerLocation?.latitude,
                lon: providerLocation?.longitude,
              }}
              zoom={10}
            /> */}
        </div>

        <div className="col-lg-6 col-xl-7 col-md-6 col-sm-12">
          <div className={styles.address_contact_container}>
            <p className={styles.about_heading_text}> Address</p>
            <div className={styles.address_content}>
              <p className={styles.business_name}>
                {businessDetails?.business_name}
              </p>
              <div className={styles.address}>
                <LocationOnIcon style={locationMallIcon} />
                <p className={styles.address_text}>{sellerPrettyAddress}</p>
              </div>
            </div>
            <div className={styles.business_details}>
              <p className={styles.about_heading_text}> Businees Details</p>
              <div className={styles.address_content}>
                <p
                  className={styles.address_text}
                >{`bppid:${businessDetails?.bpp_id}`}</p>
                <p
                  className={styles.address_text}
                >{`bppUrl:${businessDetails?.bpp_uri}`}</p>
                <p
                  className={styles.address_text}
                >{`businessId:${businessDetails?.business_id}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const locationMallIcon = { width: "30px", height: "30px", color: "green" };
export default React.memo(AboutScreen);
