import { Location,Address } from "./AddressInterfaces";
import { CartVerifyPayloadInterface } from "./PayloadsInterfaces";
export interface Product {
  item_id: string;
  bpp_id: string;
  bpp_uri: string;
  location?: Location;
  business_id: string;
  business_name: string;
  product_name: string;
  poduct_name_indexes?: string[];
  price: number;
  imageUrl: string;
  location_id?: string;
  business_location_ids?: string[];
  city_code?: string;
  unique_id?: string;
}
//item_id for two different seller porduct could be same
//but unique_id will be unique
export enum CartVerifyStatus{
 VERIFIED= "VERIFIED",
 FAILED="FAILED",
 PANDING="PENDING"
}
export interface ProductDetailsInterface {
  cancellable?: boolean;

  category?: string;

  cod_available?: boolean;

  code?: String;

  composition?: string;

  fulfillment_id?: string;

  id: string;

  images?: string[];

  item_name?: string;

  location_id?: string;

  long_desc?: string;

  mrp?: number;

  parent_item_id?: string;

  price?: number;

  return_window?: string;

  returnable?: boolean;

  seller_pickup_return: boolean;

  short_desc: string;

  support_contacts?: string[];

  symbol?: string;

  time_to_ship?: string;
  bpp_id: string,
  bpp_uri: string,
  location: Location,
  business_id: string,
  business_name:string,
  business_location_ids: string[],
  imageUrl?:string,
  city_code?: string,
}
export interface CostBreakupInterface{
  id:string,
  price:number,
  title:string,
  quantity:string,
  type:string
}
export interface CartVerificationError{
  code:string

message:string
path:string
type:string

}
// interface for address to lat lon api response
export interface CartVerifyResInterface extends CartVerifyPayloadInterface{
 cost:{
   breakup:CostBreakupInterface[],


 }
 status:CartVerifyStatus,
 transactionId:string,
 error:CartVerificationError
}
export interface locationResponse{
  place_id: string,
        licence: string,
        osm_type: string,
        osm_id:string,
        boundingbox: string [],
        lat: string,
        lon: string,
        display_name: string,
        class: string,
        type:string,
        importance: string
}
export interface BusinessSearchRes{
  id:string,
  name:string,
  searchIndexes:string[]
}
export interface BusinessDetails{
  bpp_id:string,
bpp_uri:string,
business_id:string,

locations_details:{
  address:Address,
  location:Location
}
business_name:string,
businessImageUrl:string,




}
