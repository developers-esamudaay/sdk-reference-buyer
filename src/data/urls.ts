
import { Location } from "../interfaces/AddressInterfaces";
export const Urls: any = {
  sdkBaseUrl: "https://api.test.esamudaay.com",
  osmBaseUrl: "https://nominatim.openstreetmap.org",
  locationIqBaseUrl: "https://us1.locationiq.com/v1",
  verifyCartUrl: "/api/v1/ondc/sdk/buyer/carts",
  OrderUrl: "/api/v1/ondc/sdk/buyer/orders",
  orderSupportUrl: "/api/v1/ondc/sdk/buyer/support",
  reverseGeoCodeUrl: "/reverse",
  goeLocationSuggetion: "/search",
  findLatLngUrl: (areaCode: String, door: String) =>
    `search?key=${process.env.REACT_APP_LOCATION_IQ_KEY}& q=${door},${areaCode}&format=json`,
  locationSuggetionUrl: (query: String) =>
    `/autocomplete?key=${process.env.REACT_APP_LOCATION_IQ_KEY??"pk.5f5daaeffc2eb3d8822a194dd499df69"}&q=${query}&format=json&countrycodes=in&limit=5`,
  findAddressUrl:(loc:Location)=>`/reverse?key=${process.env.REACT_APP_LOCATION_IQ_KEY??"pk.5f5daaeffc2eb3d8822a194dd499df69"}&lat=${loc?.lat}&lon=${loc?.lon}&format=json`
};
