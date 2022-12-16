import SearchBanner from "../../pages/ProductListing/Components/SearchBanner"
import { Link } from "react-router-dom"
import styles from "./Navbar.module.scss"
const Navbar=({search,
    setSearch,
    checkSearch,
    inlineError,setInlineError,fromProductPage,setToggleCollapse})=>(
<nav className={styles.navBar}>
<div style={{display:"flex",justifyContent:"space-between"}}>
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
    fromProductPage&&<SearchBanner
    search={search}
    setSearch={setSearch}
    checkSearch={checkSearch}
    inlineError={inlineError}
    setInlineError={setInlineError}
  />
 }

</div>
<div style={{ display: "flex",justifyContent:"space-between",width:"15%"}}>
<div className={styles.nav_item}>
<Link
    
    onClick={()=>setToggleCollapse(true)} 
    className={styles.nav_item_text}
   >
     Cart
   </Link>

 </div>
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

 {/* Location Dropdown menu  */}
 
 {/* Search bar to search product */}
</nav>
)
export default Navbar