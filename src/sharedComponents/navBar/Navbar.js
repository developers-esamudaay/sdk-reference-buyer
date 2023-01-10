import {useState,useContext} from "react"
import SearchBar from "../searchBanner/SearchBar"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
import Loading from "../loading/Loading"
import location from "../../assets/images/location.png"
import searchImage from "../../assets/images/search_icon.png"
import cartIcon from "../../assets/images/cart_icon.png"
import { CartContext } from "../../contextProviders/cartContextProvider"
const ShowCurrentAddress=({currentAddress,addressLoading,setShowSearchLocationModal})=>{
  const {city,state,country,areaCode,door}=currentAddress

  const prettyAddress=(city??"")+", "+(state??"")+", "+(areaCode??"");

return (
  <>
  {
    addressLoading?<Loading/>:(  <div style={{display:"flex",cursor:"pointer",marginTop:"10px"}} onClick={()=>setShowSearchLocationModal(true)}>
      <img src={location} height={"20px"}/>
      <p className={styles.addres_text}>{prettyAddress}</p>
      </div>)
  }
   
     </>
)
   
}
const Navbar=({search,
    setSearch,
    checkSearch,
    inlineError,setInlineError,fromProductPage,setToggleCollapse,currentAddress,addressLoading,setShowSearchLocationModal})=>{
      const [showSearchBar,setShowSearchBar]=useState(false)
      const {setShowCartInfo,cartData}=useContext(CartContext);
     
     return   (
      <nav className={styles.navBar}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end"}}>
      
       {
       
          fromProductPage&&(
            <>
        
        <ShowCurrentAddress currentAddress={currentAddress} addressLoading={addressLoading} setShowSearchLocationModal={setShowSearchLocationModal}/>
      
        </>
      
        )
       
       }
      
      </div>
      <div >
       <div className={styles.nav_right_items}>
    
    {
      showSearchBar&&<SearchBar
      search={search}
      setSearch={setSearch}
      checkSearch={checkSearch}
      inlineError={inlineError}
      setInlineError={setInlineError}
      placeholder={"type product name"}
      padding={"5px"}
    />
    
    }

    {
      fromProductPage&&   <div className={styles.nav_item_search} onClick={()=>setShowSearchBar(true)}>
      {
        !showSearchBar&& <div style={{display:"flex",alignItems:"center"}}>
        <img src={searchImage} height={"25px"}/>
    
     <p
        
         className={styles.nav_item_search_text}
         
       >
         Search
       </p>
       </div>
      }
    
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
      fromProductPage&&  <div className={styles.nav_item}   onClick={()=>setShowCartInfo(true)} >
      
      <div class={styles.cart_wrapper}>
       <img src={cartIcon} width={"20px"}/>
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
      
      </div>
      </div>
      
       {/* Location Dropdown menu  */}
       
       {/* Search bar to search product */}
      </nav>
      )
    }
  
export default Navbar