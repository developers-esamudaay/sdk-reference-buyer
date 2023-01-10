import React, { useContext, useEffect, useState } from "react";

import styles from "../../../../src/styles/checkout/address/addAddressModal.module.scss";

import Button from "../../../sharedComponents/button/Button";
import { APP_COLORS } from "../../../constants/colors";
import Input from "../../../sharedComponents/input/Input";
import CrossIcon from "../../../assets/icons/CrossIcon";
import { address_types } from "../../../constants/addressTypes";
import { getLatLngFromAddress } from "../../../data/apiCall";

import ErrorMessage from "../../../sharedComponents/errorMessage/ErrorMessage";
import validator from "validator";
import { AddressContext } from "../../../contextProviders/addressContextProvider";


export default function AddressForm(props) {
  console.log(props)
  const { address_type, selectedAddress, onClose, onAddAddress,onSelectAddress,isEditingAddress,onSubmissionCompleted } = props;

  // STATES

  const [address, setAddress] = useState(selectedAddress);
  const { addNewDeliveryAddresses, addNewBillingAddresses,editDeliveryAddress, currentAddress,setSelectedDeliveryAddress } =
    useContext(AddressContext);
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
    if(!isEditingAddress){
      console.log("in useEffect")
      setAddress((address) => ({
        ...address,
        door: currentAddress?.door,
        city: currentAddress?.city,
        state: currentAddress?.state,
        areaCode: currentAddress?.areaCode,
      }));
    }
  
  }, []);

  function checkName() {
    if (!address?.name) {
   
      setError((error) => ({
        ...error,
        name_error: "Please enter Name",
      }));
      return false;
    }
    return true;
  }

  function checkEmail() {
    if (!address?.email) {
      setError((error) => ({
        ...error,
        email_error: "Please enter Email",
      }));
      return false;
    }
    if (!validator.isEmail(address?.email)) {
      setError((error) => ({
        ...error,
        email_error: "Please enter a valid Email",
      }));
      return false;
    }
    return true;
  }

  function checkPhoneNumber() {
    if (!address?.phone) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    if (!validator.isMobilePhone(address?.phone, "en-IN")) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    return true;
  }

  function checkStreetName() {
    if (!address?.street) {
      setError((error) => ({
        ...error,
        street_name_error: "Street Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkLandMark() {
    if (!address?.door) {
      setError((error) => ({
        ...error,
        door_error: "Landmark cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkCity() {
    if (!address?.city) {
      setError((error) => ({
        ...error,
        city_name_error: "City Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkState() {
    if (!address?.state) {
      setError((error) => ({
        ...error,
        state_name_error: "State Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkPinCode() {
    if (!address?.areaCode) {
      setError((error) => ({
        ...error,
        areaCode_error: "Area Code cannot be empty",
      }));
      return false;
    }
    if (address?.areaCode?.length < 6) {
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
      console.log("edit address")
      setAddAddressLoading(true);
      const res = await getLatLngFromAddress(address);
      console.log(res, "res");
      const location =
        res?.data && Array.isArray(res?.data) && res?.data?.length > 0
          ? {
              lat: res?.data[0]?.lat,
              lon: res?.data[0]?.lon,
            }
          : {
              lat: 12.9783692,
              lon: 77.6408356,
            };

      setAddAddressLoading(false);
      const addressWithLatLng={...address,location:location}
     isEditingAddress?editDeliveryAddress(props.addressId,addressWithLatLng):addNewDeliveryAddresses({ ...addressWithLatLng, id: Math.random() });

      
      onSelectAddress(addressWithLatLng)
      onSubmissionCompleted()
     
    }
  }

  // use this function to fetch city and pincode

  return (
    <div style={{width:"70%",marginLeft:"15%"}}>
      <div className={styles.card_body}>
        <div className={styles.address_form_wrapper}>
          <div className={"container"}>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <Input
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  type="text"
                  placeholder="Enter Name"
                  id="name"
                  value={address?.name}
                  has_error={error.name_error}
                  onChange={(event) => {
                    const name = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      name: name,
                    }));
                    setError((error) => ({
                      ...error,
                      name_error: "",
                    }));
                  }}
                  onBlur={checkName}
                />
                <ErrorMessage>{error.name_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-6">
                <Input
                  type="email"
                  placeholder="Enter Email"
                  id="email"
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  value={address?.email}
                  has_error={error.email_error}
                  onChange={(event) => {
                    const name = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      email: name,
                    }));
                    setError((error) => ({
                      ...error,
                      email_error: "",
                    }));
                  }}
                  onBlur={checkEmail}
                />
                <ErrorMessage>{error.email_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-">
                <Input
                  type="text"
                  maxlength="10"
                  placeholder="Enter Phone"
                  id="phone"
                  value={address?.phone}
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  has_error={error.phone_error}
                  onChange={(event) => {
                    const regexp = /^[0-9]+$/;
                    if (
                      !regexp.test(event.target.value) &&
                      event.target.value !== ""
                    )
                      return;
                    const name = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      phone: name,
                    }));
                    setError((error) => ({
                      ...error,
                      phone_error: "",
                    }));
                  }}
                  onBlur={checkPhoneNumber}
                />
                <ErrorMessage>{error.phone_error}</ErrorMessage>
              </div>

              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  placeholder="Enter Landmark"
                  id="landmark"
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  has_error={error.door_error}
                  value={address?.door}
                  onChange={(event) => {
                    const name = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      door: name,
                    }));
                    setError((error) => ({
                      ...error,
                      door_error: "",
                    }));
                  }}
                  onBlur={checkLandMark}
                />
                <ErrorMessage>{error.door_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  pattern="\d*"
                  maxlength="6"
                  placeholder="Enter Pin code"
                  id="pin_code"
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  value={address?.aßreaCode}
                  has_error={error.areaCode_error}
                  onChange={(event) => {
                    const regexp = /^[0-9]+$/;
                    if (
                      !regexp.test(event.target.value) &&
                      event.target.value !== ""
                    )
                      return;
                    const areaCode = event.target.value;
                 
                    setAddress((address) => ({
                      ...address,
                      areaCode: areaCode,
                    }));
                    setError((error) => ({
                      ...error,
                      areaCode_error: "",
                    }));
                  }}
                  onBlur={checkPinCode}
                />
                <ErrorMessage>{error.areaCode_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  placeholder="Enter City"
                  id="city"
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  value={address?.city}
                  has_error={error.city_name_error}
                  onChange={(event) => {
                    const city = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      city: city,
                    }));
                  }}
                />
                <ErrorMessage>{error.city_name_error}</ErrorMessage>
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  type="text"
                  placeholder="Enter State"
                  id="state"
                  style={{
                    borderTop: "0px solid",
                    borderLeft: "0px solid",
                    borderRight: "0px solid",
                    outline: "none",
                    borderRadius: "0px",
                  }}
                  has_error={error.state_name_error}
                  value={address?.state}
                  onChange={(event) => {
                    const state = event.target.value;
                    setAddress((address) => ({
                      ...address,
                      state: state,
                    }));
                  }}
                />
                <ErrorMessage>{error.state_name_error}</ErrorMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div
        className={`${styles.card_footer} `}
      >
        <Button
          isloading={addAddressLoading}
          btnBackColor={APP_COLORS.OrangeColor}
          hoverBackColor={APP_COLORS.DARK_ORANGE_COLOR}
          buttonTextColor={APP_COLORS.WHITE}
          hoverTextColor={APP_COLORS.WHITE}
          btnBorder={`1px solid ${APP_COLORS.DARK_ORANGE_COLOR}`}
          button_text="Save And Delivered Here"
          onClick={() => {
          
              handleAddDeliveryAddress()
       
          }}
        />
         <div style={{cursor:"pointer"}} onClick={()=>onClose()}> 
          <p className={styles.cance_text}> Cancel</p>
         </div>
      </div>
    </div>
  );
}
