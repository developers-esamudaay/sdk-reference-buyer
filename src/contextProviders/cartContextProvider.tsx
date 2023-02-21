import { createContext, useState, useEffect, useMemo, useContext } from "react";

import React from "react";
import {
  CartDataInterface,
  CartItemInterface,
} from "../interfaces/CartInterface";
import { Product } from "../interfaces/ResponseInterfaces";
import {
  showSuccessMsg,
  showWarningMsg,
  msgPosition,
} from "./toastMessegeProvider";
export interface CartInterface {
  cartData: CartDataInterface;
  setCartData: (prev: CartDataInterface) => void;
  onRemoveProduct: (id: string) => void;
  onReduceQuantity: (id: string) => void;
  onAddQuantity: (id: string) => void;
  onAddProduct: (item: Product) => void;
  cartTotalPrice: string | number;
  showCartInfo: boolean;
  setShowCartInfo: (x: boolean) => void;
  totalOrderPrice: number;
  setToltalOrderPrice: (x: number) => void;
}
const cart: CartInterface = {
  cartData: { items: [] },
  setCartData: () => {},
  onRemoveProduct: () => {},
  onReduceQuantity: () => {},
  onAddQuantity: () => {},
  onAddProduct: () => {},
  cartTotalPrice: 0,
  showCartInfo: false,
  setShowCartInfo: () => {},
  totalOrderPrice: 0,
  setToltalOrderPrice: () => {},
};
export const CartContext = createContext<CartInterface>(cart);

type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const CartContextProvider: React.FC<Props> = ({ children }) => {
  const parsedCartData: CartDataInterface = JSON.parse(
    localStorage.getItem("cartData") || '{"items":[]}'
  );

  const [cartData, setCartData] = useState<CartDataInterface>(parsedCartData);
  const [showCartInfo, setShowCartInfo] = useState<boolean>(false);
  const [totalOrderPrice, setToltalOrderPrice] = useState<number>(0);
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }, [cartData]);

  // use this function to remove the product from cart
  function removeProductFromCart(id: string) {
    const newCartItems = cartData.items.filter(
      (item: CartItemInterface) => item.id !== id
    );
    setCartData((prevCart: CartDataInterface) => {
      return { ...prevCart, items: newCartItems };
    });
  }

  const totalCartPrice = useMemo(() => {
    let sum = 0;
    cartData?.items?.forEach(({ quantity, price }: CartItemInterface) => {
      if (quantity.count < 2) {
        sum += Number(price );
        return;
      } else {
        sum += quantity.count * Number(price);
      }
    });
    return Number.isInteger(sum) ? sum : sum.toFixed(2);
  }, [cartData?.items]);

  // use this function to reduce the quantity of the product;
  function reduceQuantityOfProduct(id: string) {
    const updatedProducts = cartData.items.map((item: CartItemInterface) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count - 1 } };
      }
      return { ...item };
    });
    // find the product and check if quantity is now 0
    const product = updatedProducts.find(
      (item: CartItemInterface) => item.id === id
    );
    // if the quantity is 0 than we will remove from list
    if (product?.quantity.count === 0) {
      const filteredProducts = cartData.items.filter(
        (item: CartItemInterface) => item.id !== id
      );
      setCartData((prevCart: CartDataInterface) => {
        return { ...prevCart, items: filteredProducts };
      });
      return;
    }
    setCartData((prevCart: CartDataInterface) => {
      return { ...prevCart, items: updatedProducts };
    });
  }

  // use this function to add quantity of product
  function addQuantityOfProduct(id: string) {
    const updatedProducts = cartData.items.map((item: CartItemInterface) => {
      if (item.id === id) {
        return { ...item, quantity: { count: item.quantity.count + 1 } };
      }
      return { ...item };
    });
    setCartData((prevCart: CartDataInterface) => {
      return { ...prevCart, items: updatedProducts };
    });
  }
  // currenly we only support only single business product in cart 
  

  function onAddProductsToCart({
    item_id,
    bpp_id,
    bpp_uri,

    business_id,
    business_name,
    product_name,
  
    price,
    imageUrl,
    location_id,
    business_location_ids,
    city_code,

  }: Product) {

    if (cartData.items && cartData.items.length === 0) {
      showSuccessMsg({
        position: msgPosition.TOP_RIGHT,
        msg: `${product_name} is succesfully added to cart`,
      });
      console.log(business_location_ids)
      setCartData((prevCart: CartDataInterface):CartDataInterface => {
        return {
          
          cart_id: `CART-ID-${Math.floor(1000 + Math.random() * 900)}`,
          bpp_uri: bpp_uri,
          bpp_id: bpp_id,
          business_id: business_id,
          city_code: city_code,
          business_location_ids: business_location_ids,
          items: [
            {
              id: item_id,
              quantity: {
                count: 1,
              },
              location_id: location_id??"",
              price: price,
              imageUrl: imageUrl,
              product_name: product_name,
              business_name: business_name,
            },
          ],
        };
      });
    } else {
      if (bpp_id === cartData.bpp_id) {
        showSuccessMsg({
          position: msgPosition.TOP_RIGHT,
          msg: `${product_name} is succesfully added to cart`,
        });
        const updatedProducts:CartItemInterface[] = [
          ...cartData.items,
          {
            id: item_id,
            quantity: {
              count: 1,
            },
            location_id: location_id??"",
            price: price,
            imageUrl: imageUrl,
            product_name: product_name,
            business_name: business_name,
          },
        ];
        setCartData((prevCart: CartDataInterface):CartDataInterface => {
          return { ...prevCart, items: updatedProducts };
        });
      } else {
        showWarningMsg({
          position: msgPosition.BOTTOM_RIGHT,
          msg: "you can not add product from diffrent provider",
        });
        setCartData({ items: [] });
        setCartData((prevCart: CartDataInterface): CartDataInterface => {
          return {
            ...prevCart,
            cart_id: `CART-ID-${Math.floor(1000 + Math.random() * 900)}`,
            bpp_uri: bpp_uri,
            bpp_id: bpp_id,
            business_id: business_id,
            city_code: city_code,
            business_location_ids: business_location_ids,
            items: [
              {
                id: item_id,
                quantity: {
                  count: 1,
                },
                location_id: location_id??"",
                price: price,
                imageUrl: imageUrl,
                product_name: product_name,
                business_name: business_name,
              },
            ],
          };
        });
        return;
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
        showCartInfo: showCartInfo,
        setShowCartInfo: setShowCartInfo,
        totalOrderPrice: totalOrderPrice,
        setToltalOrderPrice: setToltalOrderPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContextProvider