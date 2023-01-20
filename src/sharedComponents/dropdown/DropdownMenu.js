import {useState,useEffect,useRef} from "react"
import styles from "./Dropdown.module.scss"
import { Link } from "react-router-dom"
const DropdownMenu=({menuItems,children})=>{
    const [isOpen,setIsOpen]=useState(false)
    const ref=useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
           setIsOpen(false)
          }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, [  ]);
    
    const MenuItems=()=>{
        return (
            <div className={styles.dropdown} >
            {

                menuItems.map((item)=>{
                    const Icon=item?.Icon
                    return(
                        <div className={styles.dropdown_item} onClick={item?.handleClick?()=>{item?.handleClick(true)}:null} >

                            {
                                item?.Icon&&( <div class={styles.cart_wrapper}>
                                    <Icon style={{color:"green"}} />
                                     {/* {
                                      cartData.items.length>0&& <span>{cartData.items.length} </span>
                                     } */}
                                     
                                    </div>)
                            }
                                <Link
                                to={{
                        pathname: item?.path,
                    
                    }}
                  
                   className={styles.dropdown_item_text}
                    
                        >
                        {item?.text}
                        </Link>
                        </div>
                    )

                })
            }
            </div>
        )
    }


    return (
        <div onClick={()=>setIsOpen((prev)=>!prev)} ref={ref} className={styles.dropdown_wrapper} >
            <div className={styles.header_content}>
          
            {children}
        </div>
        {
            isOpen&&<MenuItems/>
        }
        </div>
    )
}
export default DropdownMenu