import { useState, useContext } from "react";
import SearchBar from "../searchBanner/SearchBar";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";
import Loading from "../loading/Loading";
import { Address } from "../../interfaces/AddressInterfaces";
import searchImage from "../../assets/images/search_icon.png";
import React from "react";
import { CartContext } from "../../contextProviders/cartContextProvider";

import PinDropIcon from "@mui/icons-material/PinDrop";
import EditLocationAltRoundedIcon from "@mui/icons-material/EditLocationAltRounded";
import LocalMallIcon from "@mui/icons-material/LocalMall";

import Avatar from "react-avatar";
import DropdownMenu from "../dropdown/DropdownMenu";
type ShowCurrentAddressProps={
  currentAddress:Address|null,
  addressLoading?:boolean,
  setShowSearchLocationModal?:(x:React.SetStateAction<boolean>)=>void
}
const ShowCurrentAddress:React.FC<ShowCurrentAddressProps> = ({
  currentAddress,
  addressLoading,
  setShowSearchLocationModal,
}) => {
  console.log("test")
  const {
    city = "",

    areaCode = "",
   
  } = currentAddress||{} ;

  const prettyAddress = areaCode ? areaCode : city;

  return (
    <>
      {addressLoading ? (
        <Loading />
      ) : (
        <div
          style={{ display: "flex", cursor: "pointer" }}
          onClick={() =>setShowSearchLocationModal&& setShowSearchLocationModal(true)}
        >
          <p className={styles.addres_text}>{prettyAddress}</p>
          <EditLocationAltRoundedIcon
            style={{ color: "#f86c08", width: "2.2rem", height: "2.2rem" }}
          />
        </div>
      )}
    </>
  );
};
type NavbarProps={
  handleChange?: Function,
  inlineError?:string,
  fromProductPage?:boolean,
  currentAddress?:Address|null,
  addressLoading?:boolean,
  onBlur?:()=>void,
  onFocus?:()=>void,
  setShowSearchLocationModal?:(x:React.SetStateAction<boolean>)=>void,
  searchKeyword?:string,
  searchTerm?:string,
  isSearching?:boolean
  setSearchKeyword?:React.Dispatch<React.SetStateAction<string>>
}

const Navbar:React.FC<NavbarProps> = ({
  handleChange,
  inlineError,

  fromProductPage,

  currentAddress,
  addressLoading,
  setShowSearchLocationModal,
  onBlur,
  onFocus,
  searchKeyword,
  searchTerm,
  isSearching,
  setSearchKeyword

}) => {

  const { setShowCartInfo, cartData } = useContext(CartContext);
  const menuItems = [
    {
      path: "/products",
      text: "Products",
    },
    {
      path: "/orders",
      text: "Orders",
    },
    {
      path: "/cart",
      text: "Cart",
      Icon: LocalMallIcon,
    },
  ];

  return (
    <div className={styles.header}>
      <nav className={styles.navBar}>
        <div >
          <img
            src={"https://developers.esamudaay.com/images/esamudaay-red.svg"}
            style={{ maxHeight: "35px", minWidth: "140px" }}
          />
        </div>

        <div className={styles.nav_right_items}>
          {fromProductPage && (
            <div className={styles.address_wrapper}>
              <>
                <ShowCurrentAddress
                  currentAddress={currentAddress?currentAddress:null}
                  addressLoading={addressLoading}
                  setShowSearchLocationModal={setShowSearchLocationModal&&setShowSearchLocationModal}
                />
              </>
            </div>
          )}

          <div className={styles.nav_item}>
            <NavLink
              to={{
                pathname: `/products`,
              }}
              className={styles.nav_item_text}
            >
              Products
            </NavLink>
          </div>

          <div className={styles.nav_item}>
            <NavLink
              to={{
                pathname: `/orders`,
              }}
              className={styles.nav_item_text}
            >
              Orders
            </NavLink>
          </div>

          <div className={styles.nav_item}>
            <NavLink
              to={{
                pathname: `/cart`,
              }}
              className={styles.nav_item_text}
            >
              <div
                className={styles.cart_wrapper}
                style={{
                  backgroundColor:
                    cartData?.items?.length > 0 ? "green" : "#e8eaf6",
                }}
              >
                <LocalMallIcon
                  style={{
                    color: cartData?.items?.length > 0 ? "white" : "#3D4152",
                    width: "2.2rem",
                    height: "2.2rem",
                  }}
                />
                {
                  <span
                    style={{
                      color: cartData?.items?.length > 0 ? "white" : "#3D4152",
                    }}
                  >
                    {cartData.items.length}{" "}
                  </span>
                }
              </div>
            </NavLink>
          </div>

          <div className={styles.avatar_dropdown_style}>
            <DropdownMenu menuItems={menuItems}>
       
             <div className={styles.nav_toggle_label}>
              <span></span>
             </div>
            </DropdownMenu>

          </div>
        </div>

        <div className={styles.nav_search_bar}>
          {fromProductPage && (
            <SearchBar
              handleChange={handleChange?handleChange:null}
           
              handleBlur={onBlur}
              handleFocus={onFocus}
              placeholder={"What are you looking for?"}
              padding={"5px"}
              borderRadius="4px"
              height="40px"
              searchKeyword={searchKeyword}
              searchTerm={searchTerm}
              isSearching={isSearching}
              setSearchKeyword={setSearchKeyword}
            />
          )}
        </div>

        {/* Location Dropdown menu  */}

        {/* Search bar to search product */}
      </nav>
    </div>
  );
};

export default Navbar;
