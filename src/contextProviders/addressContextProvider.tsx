import { createContext, useState, useEffect, FC } from "react";
import { getAddressFromLatLng } from "../data/apiCall";
import { DeliveryAddressInfo } from "../interfaces/PayloadsInterfaces";
import { Address, Location } from "../interfaces/AddressInterfaces";
import React from "react";
export type AddressContextType = {
  deliveryAddresses: DeliveryAddressInfo[] | [];
  setDeliveryAddresses: (
    x: React.SetStateAction<DeliveryAddressInfo[] | []>
  ) => void;
  addNewDeliveryAddresses: (x: DeliveryAddressInfo) => void;
  editDeliveryAddress: (y: string, x: DeliveryAddressInfo) => void;
  selectedDeliveryAddress: DeliveryAddressInfo | null;
  setSelectedDeliveryAddress: (
    x: React.SetStateAction<DeliveryAddressInfo | null>
  ) => void;
  currentAddress: Address | null;
  setCurrentAddress: (x: React.SetStateAction<Address | null>) => void;
  currentLocation: Location | null;
  setCurrentLocation: (x: React.SetStateAction<Location | null>) => void;
  showSearchLocationModal: boolean;
  setShowSearchLocationModal: (x: React.SetStateAction<boolean>) => void;
  addressLoading: boolean;
  setAddressLoading: (x: React.SetStateAction<boolean>) => void;
};
const initialAddressContext: AddressContextType = {
  deliveryAddresses: [],

  setDeliveryAddresses: () => {},

  addNewDeliveryAddresses: () => {},

  editDeliveryAddress: () => {},
  selectedDeliveryAddress: null,
  setSelectedDeliveryAddress: () => {},

  currentAddress: null,
  setCurrentAddress: () => {},
  currentLocation: {},
  setCurrentLocation: () => {},
  showSearchLocationModal: false,
  setShowSearchLocationModal: () => {},
  addressLoading: false,
  setAddressLoading: () => {},
};
export const AddressContext = createContext<AddressContextType>(
  initialAddressContext
);
type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const savedDeliveryAddresses=localStorage.getItem("deliveraddresses")
export const AddressContextProvider: FC<Props> = ({ children }) => {
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    DeliveryAddressInfo[] | []
  >(savedDeliveryAddresses? JSON.parse(savedDeliveryAddresses):[]);

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<
    DeliveryAddressInfo | null
  >(null);

  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [showSearchLocationModal, setShowSearchLocationModal] =
    useState<boolean>(false);

  //edit delivery address on checkout
  const editDeliveryAddress = (
    addressId: string,
    updatedAddress: DeliveryAddressInfo
  ) => {
    console.log(updatedAddress);
    const updatedDeliveryAddress: DeliveryAddressInfo[] =
      deliveryAddresses?.map((addr) =>
        addr?.id === addressId ? { ...updatedAddress, id: addressId } : addr
      ) ?? [];

    setDeliveryAddresses(updatedDeliveryAddress);
  };
  //add new address on checkout
  const addNewDeliveryAddresses = (newAddress: DeliveryAddressInfo) => {
    setDeliveryAddresses((prev: DeliveryAddressInfo[]) => {
      return [...prev, newAddress];
    });
  };
  //store delivery addresses in local storage
  useEffect(() => {
    localStorage.setItem("deliveraddresses", JSON.stringify(deliveryAddresses));
  }, [deliveryAddresses]);

// fetch current address from current location
  useEffect(() => {
    (async () => {
      setAddressLoading(true);

      const currentAddress = await getAddressFromLatLng({
        lat: currentLocation?.lat,
        lon: currentLocation?.lon,
      });

      setCurrentAddress((prev) => {
        return {
          ...prev,
          city:
            currentAddress.data?.address?.city ||
            currentAddress.data?.address?.state_district,
          state: currentAddress.data?.address?.state ?? "",
          country: currentAddress.data?.address?.country,
          areaCode: currentAddress.data?.address?.postcode,
          door:
            currentAddress.data?.address?.road ||
            currentAddress.data?.address?.neighbourhood,
          pretty_address_text: currentAddress.data?.display_name,
        };
      });
      setAddressLoading(false);
    })();
  }, [currentLocation]);
  return (
    <AddressContext.Provider
      value={{
        deliveryAddresses: deliveryAddresses,

        setDeliveryAddresses: setDeliveryAddresses,

        addNewDeliveryAddresses: addNewDeliveryAddresses,

        selectedDeliveryAddress: selectedDeliveryAddress,
        setSelectedDeliveryAddress: setSelectedDeliveryAddress,

        currentAddress: currentAddress,
        setCurrentAddress: setCurrentAddress,
        currentLocation: currentLocation,
        setCurrentLocation: setCurrentLocation,
        showSearchLocationModal: showSearchLocationModal,
        setShowSearchLocationModal: setShowSearchLocationModal,
        addressLoading: addressLoading,
        setAddressLoading,
        editDeliveryAddress: editDeliveryAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
