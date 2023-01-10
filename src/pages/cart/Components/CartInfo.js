import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { CartContext } from '../../../contextProviders/cartContextProvider'
import CartItemsStyles from '../../../styles/cart/cartItemsOrderSummary.module.scss'
import CrossIcon from '../../../assets/icons/CrossIcon'
import { APP_COLORS } from '../../../constants/colors'

import epmpty_cart from "../../../assets/images/empty_cart.png"
import Button from '../../../sharedComponents/button/Button'
import ProductCard from '../../productListing/Components/ProductCard'
import Add from '../../../assets/icons/Add'
import Subtract from '../../../assets/icons/Subtract'
const CartInfo = ({ onClose }) => {

  const { cartData, setCartData, cartTotalPrice, onRemoveProduct,onAddQuantity,onReduceQuantity,setShowCartInfo} = useContext(CartContext)
  const cartItems = cartData?.items
  const history = useHistory()


  return (
    <div className={CartItemsStyles.overlay}>
      <div className={CartItemsStyles.popup_card}>
       
          <div className={CartItemsStyles.header}>
            <p className={CartItemsStyles.label}>Your Shopping Bag</p>
            <div className="ms-auto">
              <CrossIcon
                width="45"
                height="45"
                style={{ cursor: 'pointer', paddingRight: '20px' }}
                color={APP_COLORS.PRIMARYCOLOR}
                onClick={onClose}
              />
            </div>
          </div>

          <div className={CartItemsStyles.cart_items_wrapper}>
           
          
             
              
                {
                  cartItems.length==0?(<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px"}}><img src={epmpty_cart} width={"200px"} height={"200px"}/> <p>Cart is empty</p></div>):(
                    <table className={`table ${CartItemsStyles.table_image}`}>
            <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Qty</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          {cartItems.map(({product,quantity}) => {
            
                  return (
                    <tr>
                      <td>
                        <img src={product?.images[0]} width={"120px"} height={"120px"}/>
                      </td>
                      <td>{product?.item_name}</td>
                      <td>{product?.price/100}</td>
                      <td className={CartItemsStyles.qty}>
                        <div style={{display:'flex'}}>
                        <div style={{backgroundColor:"gray",padding:"3px",cursor:"pointer"}} onClick={()=>onReduceQuantity(product?.id)}>
                      <Subtract width="10" height="10" classes={CartItemsStyles.add_svg_color}/>
                      </div>
                        
                      <div style={{backgroundColor:"gray",height:"30px",width:"30px",padding:"3px"}}>
                       <p className={CartItemsStyles.qty_label}>{quantity?.count}</p>
                      </div>
                      <div style={{backgroundColor:"gray",padding:"3px",cursor:"pointer"}}  onClick={()=>onAddQuantity(product?.id)}>
                      <Add width="10" height="10"  classes={CartItemsStyles.add_svg_color} />
                      </div>
                      </div>
                      </td>
                      <td>{(product?.price/100)*quantity?.count}</td>
                      <td> <CrossIcon
                width="30"
                height="30"
                style={{ cursor: 'pointer', backgroundColor:"red",alignItems:"center" }}
                color={"white"}
                onClick={()=>onRemoveProduct(product?.id)}
              /></td>
                      

                    </tr>
                   
                  )
                })}
        </table>
                  )
                }
           
            </div>
    

    
        
        <div>
          <div className={CartItemsStyles.itemCount}>
            <p className={CartItemsStyles.label1}>Total </p>
            <p className={CartItemsStyles.total_price}>{cartTotalPrice}</p>
          </div>
          {
               cartItems.length>0&&  <div className={CartItemsStyles.bottomButtons}>
               
                
                 <div style={{cursor:"pointer"}}        onClick={() => setCartData({items:[]})}> 
          <p className={CartItemsStyles.cance_text}> Clear Cart</p>
         </div>
               
              
   
               <Button
                btnBackColor={APP_COLORS.SUCCESS}
                hoverBackColor={APP_COLORS.DARK_SUCCES}
                buttonTextColor={APP_COLORS.WHITE}
                hoverTextColor={APP_COLORS.WHITE}
  
                 button_text="Checkout"
                 onClick={() =>{ setShowCartInfo(false); history.push('/checkout')}}
               />
             </div>
          }
        
        </div>
      </div>
    </div>
  )
}
export default CartInfo
