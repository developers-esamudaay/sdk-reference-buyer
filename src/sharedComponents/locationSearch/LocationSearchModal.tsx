import { useState, useEffect, useContext } from "react";
import  styles from "./LocationSearchModal.module.scss";
import SearchBar from "../searchBanner/SearchBar";
import { getLocationSuggetion } from "../../data/apiCall";
import {
  AddressContext,
  AddressContextType,
} from "../../contextProviders/addressContextProvider";
import CrossIcon from "../../assets/icons/CrossIcon";
import { debouncedFunction, isEmptyObject } from "../../commonUtils";
import PlaceIcon from "@mui/icons-material/Place";
import { Location } from "../../interfaces/AddressInterfaces";
import MapView from "../mapView/MapView";
import React from "react";
import useDebounce from "customHooks/useDebounce";
type LocationSuggetionType = {
  firstText: string;
  secondText: string;
  location: Location;
  place_id: string;
};
const LocationSearchModal = () => {
  
  const [locatioSearchSuggetions, setLocationSearchSuggetions] = useState<
    LocationSuggetionType[] | []
  >([]);
  const [suggetionsLoading, setSuggetionsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const debounceSearchTrem: string = useDebounce(searchTerm, 500);
  const {
    currentLocation,
    setCurrentLocation,
    showSearchLocationModal,
    setShowSearchLocationModal,
    currentAddress,
  }: AddressContextType = useContext(AddressContext);

  const [showLocationSuggetion, setShowLocationSuggestion] = useState(true);
  console.log(currentAddress);
  const onSelecteLocation = (address: LocationSuggetionType) => {
    setIsSearching(false)
    setShowLocationSuggestion(false);
    setCurrentLocation &&
      setCurrentLocation({
        lat: address?.location?.lat ?? 0.0,
        lon: address?.location?.lon ?? 0.0,
      });
  };
  const userCurrentLocation = {
    latitude: currentLocation?.lat,
    longitude: currentLocation?.lon,
  };
  useEffect(() => {
     (async()=>{
      setIsSearching(true)
      await fetchLocationSuggestion(debounceSearchTrem)
     })()
  }, [debounceSearchTrem]);
  console.log(locatioSearchSuggetions);
  const fetchLocationSuggestion = async (value: string) => {
    console.log(value);
    const response = await getLocationSuggetion(value);
    console.log(response);
    const searchSuggetions: LocationSuggetionType[] = response.data.map(
      (item: any) => {
        const splitedText = item?.display_name.split(",");
        return {
          firstText:
            Array.isArray(splitedText) &&
            splitedText.length > 0 &&
            splitedText[0],
          secondText:
            Array.isArray(splitedText) &&
            splitedText.length > 0 &&
            splitedText.slice(1).join(","),
          location: {
            lat: item?.lat,
            lon: item?.lon,
          },
          place_id: item?.place_id,
        };
      }
    );

    setLocationSearchSuggetions(searchSuggetions);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          onClick={() =>
            setShowSearchLocationModal && setShowSearchLocationModal(false)
          }
        >
          <CrossIcon width={"30px"} height={"30px"} color={"black"} />
        </div>
        <div className={styles.content}>
          <div style={{ width: "75%" }}>
            <SearchBar
              handleChange={(value:string)=>setSearchTerm(value)}
              placeholder="search your location"
              borderRadius="0px"
              height="50px"
              searchTerm={searchTerm}
              isSearching={isSearching}

              
            />
          </div>

          <div
            style={{
              zIndex: "2000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "absolute",
              top: "140px",
              backgroundColor: "white",
            }}
          >
            { showLocationSuggetion&& locatioSearchSuggetions?.map((searchItem) => {
                  return (
                    <div
                      key={searchItem?.place_id}
                      style={{
                        width: "90%",
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      onClick={() => onSelecteLocation(searchItem)}
                    >
                      <PlaceIcon style={{ color: "#f86c08" }} />
                      <div
                        style={{
                          width: "270px",
                          marginLeft: "15px",
                          borderBottom: "1px solid gray",
                        }}
                      >
                        <p className={styles.first_text}>
                          {searchItem.firstText}
                        </p>
                        <p className={styles.second_text}>
                          {searchItem.secondText}
                        </p>
                      </div>
                    </div>
                  );
                })
             }
          </div>
          {/* <div className={styles.map_wrapper}>
            <MapView location={currentLocation} zoom={8} />
          </div> */}
          <div className={styles.current_address_wrapper}>
            <p className={styles.address_header}>Address</p>
            <p className={styles.address_text}>
              {currentAddress?.pretty_address_text}
            </p>
            <div className={styles.confirm_button_container}>
              <button
                className={styles.confirm_button}
                onClick={() =>
                  setShowSearchLocationModal &&
                  setShowSearchLocationModal(false)
                }
              >
                Save This Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LocationSearchModal;
