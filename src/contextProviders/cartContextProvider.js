import { createContext, useState, useEffect, useMemo } from 'react'
import { getSubTotal } from '../commonUtils'
export const CartContext = createContext({
  cartData: { items: [] },
  setCartData: () => {},
  onRemoveProduct: () => {},
  onReduceQuantity: () => {},
  onAddQuantity: () => {},
  onAddProduct: () => {},
  cartTotalPrice: 0,
  showCartInfo:false,
  setShowCartInfo:()=>{}
})


export function CartContextProvider({ children }) {
  const parsedCartData = JSON.parse(localStorage.getItem('cartData') || '{"items":[]}')

  const [cartData, setCartData] = useState(parsedCartData)
  const [showCartInfo,setShowCartInfo]=useState(false)
  
  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cartData))
  }, [cartData])

  // use this function to remove the product from cart
  function removeProductFromCart(id) {
    const newCartItems = cartData.items.filter((item) => item.id !== id)
    setCartData((prevCart) => {
      return { ...prevCart, items: newCartItems }
    })
  }
  const totalCartPrice = useMemo(() => {
    let sum = 0
    cartData?.items?.forEach(({ product, quantity }) => {
      if (quantity.count < 2) {
        sum += Number(product.price / 100)
        return
      } else {
        sum += quantity.count * Number(product.price / 100)
      }
    })
    return Number.isInteger(sum) ? sum : sum.toFixed(2)
  }, [cartData?.items])

  // use this function to reduce the quantity of the product;
  function reduceQuantityOfProduct(id) {
    const updatedProducts = cartData.items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count - 1 } }
      }
      return { ...item }
    })
    // find the product and check if quantity is now 0
    const product = updatedProducts.find((item) => item.id === id)
    // if the quantity is 0 than we will remove from list
    if (product.quantity.count === 0) {
      const filteredProducts = cartData.items.filter((product) => product.id !== id)
      setCartData((prevCart) => {
        return { ...prevCart, items: filteredProducts }
      })
      return
    }
    setCartData((prevCart) => {
      return { ...prevCart, items: updatedProducts }
    })
  }

  // use this function to add quantity of product
  function addQuantityOfProduct(id) {
    const updatedProducts = cartData.items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count + 1 } }
      }
      return { ...item }
    })
    setCartData((prevCart) => {
      return { ...prevCart, items: updatedProducts }
    })
  }

  function onAddProductsToCart({ product, id, location_id, quantity, onErrorAddToCart }) {
    if (cartData.items && cartData.items.length === 0) {
     
      setCartData((prevCart) => {
        return {
          ...prevCart,
          cart_id: `CART-ID-${Math.floor(1000 + Math.random() * 900)}`,
          bpp_uri: product?.bpp_uri,
          bpp_id: product?.bpp_id,
          business_id: product?.business_id,
          city_code: product?.city_code,
          business_location_ids: product?.locations?.map((location) => location.id),
          items: [
            {
              id: product?.id,
              quantity: quantity,
              location_id: product?.location_id,
              product,
            },
          ],
        }
      })
    } else {
      if (product?.bpp_id === cartData.bpp_id) {
        const updatedProducts = [
          ...cartData.items,
          {
            id: product?.id,
            quantity: quantity,
            location_id: product?.location_id,
            product,
          },
        ]
        setCartData((prevCart) => {
          return { ...prevCart, items: updatedProducts }
        })
      } else {
        onErrorAddToCart && onErrorAddToCart('you can not add product from diffrent provider')
        setCartData({ items: [] })
        setCartData((prevCart) => {
          return {
            ...prevCart,
            cart_id: `CART-ID-${Math.floor(1000 + Math.random() * 900)}`,
            bpp_uri: product?.bpp_uri,
            bpp_id: product?.bpp_id,
            business_id: product?.business_id,
            city_code: product?.city_code,
            business_location_ids: product?.locations?.map((location) => location.id),
            items: [
              {
                id: product?.id,
                quantity: quantity,
                location_id: product?.location_id,
                product,
              },
            ],
          }
        })
        return
      }
    }
  }
  return (
    <CartContext.Provider
      value={{
        cartData,

        setCartData,
        onRemoveProduct: removeProductFromCart,
        onReduceQuantity: reduceQuantityOfProduct,
        onAddQuantity: addQuantityOfProduct,
        onAddProduct: onAddProductsToCart,
        cartTotalPrice: totalCartPrice,
        showCartInfo:showCartInfo,
        setShowCartInfo:setShowCartInfo
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
