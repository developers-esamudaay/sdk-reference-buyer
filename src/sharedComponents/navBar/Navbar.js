import {useState,useContext} from "react"
import SearchBar from "../searchBanner/SearchBar"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import Loading from "../loading/Loading"

import searchImage from "../../assets/images/search_icon.png"
import cartIcon from "../../assets/images/cart_icon.png"
import { CartContext } from "../../contextProviders/cartContextProvider"

import PinDropIcon from '@mui/icons-material/PinDrop';
import EditLocationAltRoundedIcon from '@mui/icons-material/EditLocationAltRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { HLDropdown, HLMenu, HLCard } from "synos-helena";
import Avatar from "react-avatar";
import DropdownMenu from "../dropdown/DropdownMenu"
const ShowCurrentAddress=({currentAddress,addressLoading,setShowSearchLocationModal})=>{
  const {city="",state="",country="India",areaCode="",door}=currentAddress

  const prettyAddress=areaCode?areaCode:city;

return (
  <>
  {
    addressLoading?<Loading/>:(  <div style={{display:"flex",cursor:"pointer",paddingTop:"10px"}} onClick={()=>setShowSearchLocationModal(true)}>

      <p className={styles.addres_text}>{prettyAddress}</p>
      <EditLocationAltRoundedIcon style={{color:"#f86c08"}}/>
      </div>)
  }
   
     </>
)
   
}

const Navbar=({
  handleChange,
    inlineError,setInlineError,fromProductPage,setToggleCollapse,currentAddress,addressLoading,setShowSearchLocationModal,fromProductDetailsPage})=>{
      console.log(fromProductDetailsPage)
      const [showSearchBar,setShowSearchBar]=useState(false)
      const {setShowCartInfo,cartData}=useContext(CartContext);
      const menuItems=[
        {
          path:"/products",
          text:"Products",
      
        },
        {
          path:"/orders",
          text:"Orders"
        },
        {
          handleClick:{setShowCartInfo},
          text:"Cart",
          Icon:ShoppingCartIcon
        },
      
      ]
     
     return   (
      <div className={styles.header}>
      <nav className={styles.navBar}>
        <div className={styles.nav_left_item}>
           <img src={"https://developers.esamudaay.com/images/esamudaay-red.svg"} style={{maxHeight:"35px",minWidth:"140px"}}/>
        </div>
  
   
       <div className={styles.nav_right_items}>
      
      
  

{ fromProductPage&&
       <div className={styles.address_wrapper}>
      
   
      <>
  
  <ShowCurrentAddress currentAddress={currentAddress} addressLoading={addressLoading} setShowSearchLocationModal={setShowSearchLocationModal}/>

  </>

  
 


</div>
    }
     
      <div className={styles.nav_item}>
       <Link
           to={{
             pathname: `/products`,
           
           }}
           className={styles.nav_item_text}
           
         >
           Products
         </Link>
       </div>
    {
      (fromProductPage||fromProductDetailsPage)&&  <div className={styles.nav_item}   onClick={()=>setShowCartInfo(true)} >
      
      <div class={styles.cart_wrapper}>
      <ShoppingCartIcon style={{color:"green"}} />
       {
        cartData.items.length>0&& <span>{cartData.items.length} </span>
       }
       
      </div>

      <Link
          
        
          className={styles.nav_item_text}
         >
           Cart
         </Link>
      
       </div>
    }
    
       <div className={styles.nav_item}>
       <Link
           to={{
             pathname: `/orders`,
           
           }}
           className={styles.nav_item_text}
           
         >
           Orders
         </Link>
       </div>
     
       <div className={styles.avatar_dropdown_style}>
       <DropdownMenu menuItems={menuItems}>
       {/* <input type="checkbox" id="btnControl"/> */}
       <label for="btnControl" className={styles.nav_toggle_label}>
    <span></span>
  </label>
  </DropdownMenu>
        {/* <DropdownMenu menuItems={menuItems}>
        <Avatar name="Guest" size="40" round={true} />
        </DropdownMenu> */}
       </div>
      </div>
    
      <div className={styles.nav_search_bar}>
      {
      fromProductPage&&<SearchBar
      handleChange={handleChange}
      inlineError={inlineError}
      setInlineError={setInlineError}
      placeholder={"What are you looking for?"}
      padding={"5px"}
      borderRadius="8px"
  
    />
    
    }
        </div>
      
       {/* Location Dropdown menu  */}
       
       {/* Search bar to search product */}
      </nav>
   
      </div>
      )
    }
  
export default Navbar