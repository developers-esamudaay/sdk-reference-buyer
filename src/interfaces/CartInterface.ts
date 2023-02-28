export interface CartDataInterface {
  bpp_id?: string;
  bpp_uri?: string;
  business_id?: string;
  cart_id?: string;
  city_code?: string;
  business_location_ids?: string[];
  items: CartItemInterface[];
}
export interface CartItemInterface {
  id: string;
  quantity: {
    count: number;
  };
  location_id: string;
  price: number;
  imageUrl: string;
  product_name: string;
  business_name: string;
}
