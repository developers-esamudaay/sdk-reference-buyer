import axios, { AxiosInstance } from "axios";
import { Urls } from "./urls";
import { Location } from "../interfaces/AddressInterfaces";
import {
  CartVerifyPayloadInterface,
  ConfirmOrderPayloadInterface,
  SupportOrderPayloadInterface,
  returnOrderPayloadInterface,
} from "../interfaces/PayloadsInterfaces";
import { locationResponse } from "interfaces/ResponseInterfaces";
import {
  showErrorMsg,
  msgPosition,
} from "../contextProviders/toastMessegeProvider";
//axios instance for ondcBuyer Sdk
const axoisInstanceSdk: AxiosInstance = axios.create({
  baseURL: Urls.sdkBaseUrl,
  timeout: 2000,
  headers: {
    apid: process.env.REACT_APP_API_ID,
  },
});
export interface ResponseModel {
  message: {
    ack: {
      status: String;
    };
  };
}

//interceptor to handle common error
axoisInstanceSdk.interceptors.response.use(
  (response: any) => {
    const responseData: ResponseModel = response?.data;

    if (responseData?.message?.ack?.status === "NACK") {
      showErrorMsg({
        position: msgPosition.BOTTOM_RIGHT,
        msg: "Oops something went wrong with the seller partner",
      });
    } else {
      return response;
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
//axios instance for location iq apis
const axoisInstanceLocationIq = axios.create({
  baseURL: Urls.locationIqBaseUrl,
  timeout: 10000,
});

//verify cart using ondc Buyer sdk
// for more info check verify Cart section in ondc buyer docs https://docs.google.com/document/d/17bY8DS981WyqDhh790SVAMhbJylVl_LH4r-5uXZ1yOk/edit
export const verfyCartUsingSdk = async (
  payload: CartVerifyPayloadInterface
) => {
  return await axoisInstanceSdk.post(Urls.verifyCartUrl, payload);
};

//place order using ondc buyer sdk
// for more info check confirm Order section in ondc buyer docs https://docs.google.com/document/d/17bY8DS981WyqDhh790SVAMhbJylVl_LH4r-5uXZ1yOk/edit
export const confirmOrderUsingSdk = async (
  payload: ConfirmOrderPayloadInterface
) => {
  return await axoisInstanceSdk.post(Urls.OrderUrl, payload);
};

// order actions

//track order using ondc buyer sdk
export const trackOrderFromSdk = async (orderId: String) => {
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/track`, {
    city_code: "std_080",
  });
};

//cancel order using ondc buyer sdk
export const cancelOrderFromSdk = async ({
  id,
  reason_code,
}: {
  id: String;
  reason_code: String;
}) => {
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${id}/cancel`, {
    city_code: "std:080",
    type: "CANCEL",
    meta: {
      cancel_reason_code: reason_code,
    },
  });
};

//support order using ondc buyer sdk
export const supportOrderFromSdk = async (
  orderId: String,
  payload: SupportOrderPayloadInterface
) => {
  return axoisInstanceSdk.post(Urls.orderSupportUrl, payload);
};
export const returnOrderUsingSdk = (
  payload: returnOrderPayloadInterface,
  orderId: String
) => {
  return axoisInstanceSdk.post(`${Urls.OrderUrl}/${orderId}/return`, payload);
};

//location related api Calls

// api call to get address from lattitude logitude
export const getLatLngFromAddress = async (address: {
  door: String;
  areaCode: String;
}) => {
  console.log(address);

  const res = await axoisInstanceLocationIq.get(
    Urls.findLatLngUrl(address?.areaCode, address?.door)
  );
  const location: locationResponse[] = res.data;
  return location.length > 0
    ? { lat: Number(location[0]?.lat), lon: Number(location[0]?.lon)} as Location
    : {
        lat: 13.343300703689293,
        lon: 74.79207370430231,
      } as Location;
};

// api call to get lattitude logitude from address
export const getAddressFromLatLng = async (loc: Location) => {
  return await axoisInstanceLocationIq.get(Urls.findAddressUrl(loc));
};

//api call to get location suggetion from keyword
export const getLocationSuggetion = async (query: String) => {
  return await axoisInstanceLocationIq.get(Urls.locationSuggetionUrl(query));
};
