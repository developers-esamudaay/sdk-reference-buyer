import React, { useContext, useEffect, useState } from "react";

import styles from "../../../../src/styles/checkout/address/addAddressModal.module.scss";

import Button from "../../../sharedComponents/button/Button";
import { APP_COLORS } from "../../../constants/colors";
import Input from "../../../sharedComponents/input/Input";
import CrossIcon from "../../../assets/icons/CrossIcon";

import { getLatLngFromAddress } from "../../../data/apiCall";

import ErrorMessage from "../../../sharedComponents/errorMessage/ErrorMessage";
import validator from "validator";
import { AddressContext } from "../../../contextProviders/addressContextProvider";
import { DeliveryAddressInfo } from "interfaces/PayloadsInterfaces";
import EditLocationAltRoundedIcon from "@mui/icons-material/EditLocationAltRounded";
type AddressFormProps = {
  onClose: () => void;
  onSelectAddress: (x: DeliveryAddressInfo) => void;
  isEditingAddress?: boolean;
  addressId?: string;
};
const AddressForm: React.FC<AddressFormProps> = (props) => {
  console.log(props);
  const {
    onClose,

    onSelectAddress,
    isEditingAddress,
  } = props;

  // STATES

  const {
    addNewDeliveryAddresses,

    editDeliveryAddress,
    currentAddress,
    setSelectedDeliveryAddress,
    setShowSearchLocationModal,
  } = useContext(AddressContext);
  const [fullAddress, setFullAddress] = useState<DeliveryAddressInfo | null>(
    null
  );
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [error, setError] = useState({
    name_error: "",
    email_error: "",
    phone_error: "",
    areaCode_error: "",
    city_name_error: "",
    door_error: "",
    state_name_error: "",
    street_name_error: "",
  });

  useEffect(() => {
    console.log("in useEffect");
    console.log(currentAddress);
    setFullAddress(
      (prev) =>
        ({
          ...prev,
          address: currentAddress,
        } as DeliveryAddressInfo)
    );
  }, [currentAddress]);

  function checkName() {
    if (!fullAddress?.name) {
      setError((error) => ({
        ...error,
        name_error: "Please enter Name",
      }));
      return false;
    }
    return true;
  }

  function checkEmail() {
    if (!fullAddress?.email) {
      setError((error) => ({
        ...error,
        email_error: "Please enter Email",
      }));
      return false;
    }
    if (!validator.isEmail(fullAddress?.email)) {
      setError((error) => ({
        ...error,
        email_error: "Please enter a valid Email",
      }));
      return false;
    }
    return true;
  }

  function checkPhoneNumber() {
    if (!fullAddress?.phone) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    if (!validator.isMobilePhone(fullAddress?.phone, "en-IN")) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    return true;
  }

  function checkLandMark() {
    console.log(fullAddress?.address);
    if (!fullAddress?.address?.door) {
      setError((error) => ({
        ...error,
        door_error: "Landmark cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkCity() {
    if (!fullAddress?.address?.city) {
      setError((error) => ({
        ...error,
        city_name_error: "City Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkState() {
    if (!fullAddress?.address?.state) {
      setError((error) => ({
        ...error,
        state_name_error: "State Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkPinCode() {
    if (!fullAddress?.address?.areaCode) {
      setError((error) => ({
        ...error,
        areaCode_error: "Area Code cannot be empty",
      }));
      return false;
    }
    if (fullAddress?.address?.areaCode.length < 6) {
      setError((error) => ({
        ...error,
        areaCode_error: "Please enter a valid Area Code",
      }));
      return false;
    }
    return true;
  }

  // add delivery address
  async function handleAddDeliveryAddress() {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),

      checkLandMark(),
      checkCity(),
      checkState(),
      checkPinCode(),
    ].every(Boolean);

    if (!allChecksPassed) {
      return;
    } else {
      console.log("edit address");
      setAddAddressLoading(true);
      const location = await getLatLngFromAddress({
        door: fullAddress?.address?.door ?? "",
        areaCode: fullAddress?.address?.areaCode ?? "",
      });

      setAddAddressLoading(false);

      const addressWithLatLng = {
        ...fullAddress,
        location: location,
      } as DeliveryAddressInfo;
      isEditingAddress
        ? editDeliveryAddress &&
          editDeliveryAddress(props?.addressId ?? "", addressWithLatLng)
        : addNewDeliveryAddresses &&
          addNewDeliveryAddresses({
            ...addressWithLatLng,
            id: Math.random() + "",
          });

      onSelectAddress(addressWithLatLng);
    }
  }

  // use this function to fetch city and pincode

  return (
    <div>
      <div className={styles.card_body}>
        <div
          className={styles.map_address_select}
          onClick={() =>
            setShowSearchLocationModal && setShowSearchLocationModal(true)
          }
        >
          <p className={styles.map_address_select_text}>
            Select Location using Map
          </p>
          <EditLocationAltRoundedIcon
            style={{ color: "#f86c08", width: "2.2rem", height: "2.2rem" }}
          />
        </div>
        <div className={styles.address_form_wrapper}>
          <div className={"container"}>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <Input
                  label_name="Name"
                  required
                  type="text"
                  placeholder="Enter Name"
                  id="name"
                  value={fullAddress?.name ?? ""}
                  has_error={error.name_error}
                  onChange={(event: any) => {
                    const name = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          name: name,
                        } as DeliveryAddressInfo)
                    );
                    setError((error) => ({
                      ...error,
                      name_error: "",
                    }));
                  }}
                />
                <ErrorMessage>{error.name_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-6">
                <Input
                  type="email"
                  label_name="email"
                  required
                  placeholder="Enter Email"
                  id="email"
                  value={fullAddress?.email ?? ""}
                  has_error={error.email_error}
                  onChange={(event: any) => {
                    const name = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          email: name,
                        } as DeliveryAddressInfo)
                    );
                    setError((error) => ({
                      ...error,
                      email_error: "",
                    }));
                  }}
                />
                <ErrorMessage>{error.email_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-">
                <Input
                  type="text"
                  label_name="Enter Phone"
                  required
                  placeholder="Enter Phone"
                  id="phone"
                  value={fullAddress?.phone}
                  has_error={error.phone_error}
                  onChange={(event: any) => {
                    const regexp = /^[0-9]+$/;
                    if (
                      !regexp.test(event.target.value) &&
                      event.target.value !== ""
                    )
                      return;
                    const name = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          phone: name,
                        } as DeliveryAddressInfo)
                    );
                    setError((error) => ({
                      ...error,
                      phone_error: "",
                    }));
                  }}
                />
                <ErrorMessage>{error.phone_error}</ErrorMessage>
              </div>

              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  label_name="Landmark"
                  required
                  placeholder="Enter Landmark"
                  id="landmark"
                  has_error={error.door_error}
                  value={fullAddress?.address?.door ?? ""}
                  onChange={(event: any) => {
                    const door = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          address: {
                            ...address?.address,
                            door: door,
                          },
                        } as DeliveryAddressInfo)
                    );
                    setError((error) => ({
                      ...error,
                      door_error: "",
                    }));
                  }}
                />
                <ErrorMessage>{error.door_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  label_name="Pincode"
                  required
                  placeholder="Enter Pin code"
                  id="pin_code"
                  value={fullAddress?.address?.areaCode}
                  has_error={error.areaCode_error}
                  onChange={(event: any) => {
                    const regexp = /^[0-9]+$/;
                    if (
                      !regexp.test(event.target.value) &&
                      event.target.value !== ""
                    )
                      return;
                    const areaCode = event.target.value;

                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          address: {
                            ...address?.address,
                            areaCode: areaCode,
                          },
                        } as DeliveryAddressInfo)
                    );
                    setError((error) => ({
                      ...error,
                      areaCode_error: "",
                    }));
                  }}
                />
                <ErrorMessage>{error.areaCode_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  label_name="City"
                  required
                  placeholder="Enter City"
                  id="city"
                  value={fullAddress?.address?.city ?? ""}
                  has_error={error.city_name_error}
                  onChange={(event: any) => {
                    const city = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          address: {
                            ...address?.address,
                            city: city,
                          },
                        } as DeliveryAddressInfo)
                    );
                  }}
                />
                <ErrorMessage>{error.city_name_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  label_name="State"
                  required
                  placeholder="Enter State"
                  id="state"
                  has_error={error.state_name_error}
                  value={fullAddress?.address?.state ?? ""}
                  onChange={(event: any) => {
                    const state = event.target.value;
                    setFullAddress(
                      (address) =>
                        ({
                          ...address,
                          address: {
                            ...address?.address,
                            state: state,
                          },
                        } as DeliveryAddressInfo)
                    );
                  }}
                />
                <ErrorMessage>{error.state_name_error}</ErrorMessage>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card_footer} `}>
        <div className={styles.save_button_container}>
          <button
            className={styles.save_button}
            onClick={() => handleAddDeliveryAddress()}
          >
            Save And Continue
          </button>
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => onClose()}>
          <p className={styles.cance_text}> Cancel</p>
        </div>
      </div>
    </div>
  );
};
export default AddressForm;
