import { createContext, useState, useEffect } from 'react'
import { getAddressFromLatLng } from '../data/apiCall'
export const AddressContext = createContext({
  deliveryAddresses: [],
  billingAddresses: [],
  setDeliveryAddresses: () => {},
  setBillingAddresses: () => {},
  addNewDeliveryAddresses: () => {},
  addNewBillingAddresses: () => {},
  editBillingAddress: () => {},
  editDeliveryAddress: () => {},
  selectedDeliveryAddress: {},
  setSelectedDeliveryAddress: () => {},
  selectedBillingAddress: {},
  setSelectedBillingAddress: () => {},
  currentAddress:{},
  setCurrentAddress:()=>{},
  currentLocation:{},
  setCurrentLocation:()=>{},
  showSearchLocationModal:false,
  setShowSearchLocationModal:()=>{},
  addressLoading:false,
  setAddressLoading:()=>{}

})

export const AddressContextProvider = ({ children }) => {
  const [addressLoading,setAddressLoading]=useState(false)
  const [deliveryAddresses, setDeliveryAddresses] = useState(
    JSON.parse(localStorage.getItem('deliveraddresses')) || [],
  )
  const [billingAddresses, setBillingAddresses] = useState(
    JSON.parse(localStorage.getItem('billingAddresses')) || [],
  )

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState({})
  const [selectedBillingAddress, setSelectedBillingAddress] = useState({})
  const [currentAddress,setCurrentAddress]=useState({})
  const [currentLocation,setCurrentLocation]=useState({})
  const [showSearchLocationModal,setShowSearchLocationModal]=useState(false)
 
  const addNewBillingAddresses = (newAddress) => {
    setBillingAddresses((prev) => [...prev, newAddress])
  }
  const editDeliveryAddress=(addressId,updatedAddress)=>{
    console.log(updatedAddress)
    const updatedDeliveryAddress= deliveryAddresses.map((addr)=>addr?.id===addressId?{...updatedAddress,id:addressId}:addr)
    
    setDeliveryAddresses(updatedDeliveryAddress)
  }
  const addNewDeliveryAddresses = (newAddress) => {
    
    setDeliveryAddresses((prev) => {
      return [...prev, newAddress]
    })
  }
  useEffect(() => {
   
    localStorage.setItem('deliveraddresses', JSON.stringify(deliveryAddresses))
  }, [deliveryAddresses])
  useEffect(() => {
    localStorage.setItem('billingAddresses', JSON.stringify(billingAddresses))
  }, [billingAddresses])
  useEffect(async()=>{
  
    setAddressLoading(true);


    
    const currentAddress=await getAddressFromLatLng({lat:currentLocation?.lat,lon:currentLocation?.lon});
        
    
    setCurrentAddress((prev)=>{return{...prev,city:currentAddress.data?.address?.city||currentAddress.data?.address?.state_district,state:currentAddress.data?.address?.state??"",country:currentAddress.data?.address?.country,areaCode:currentAddress.data?.address?.postcode,door:currentAddress.data?.address?.road||currentAddress.data?.address?.neighbourhood,pretty_address_text:currentAddress.data?.display_name}})
    setAddressLoading(false)
  },[currentLocation])
  return (
    <AddressContext.Provider
      value={{
        deliveryAddresses: deliveryAddresses,
        billingAddresses: billingAddresses,

        setDeliveryAddresses: setDeliveryAddresses,
        setBillingAddresses: setBillingAddresses,
        addNewDeliveryAddresses: addNewDeliveryAddresses,
        addNewBillingAddresses: addNewBillingAddresses,

        selectedDeliveryAddress: selectedDeliveryAddress,
        setSelectedDeliveryAddress: setSelectedDeliveryAddress,
        selectedBillingAddress: selectedBillingAddress,
        setSelectedBillingAddress: setSelectedBillingAddress,
        currentAddress:currentAddress,
        setCurrentAddress:setCurrentAddress,
        currentLocation:currentLocation,
        setCurrentLocation:setCurrentLocation,
        showSearchLocationModal:showSearchLocationModal,
        setShowSearchLocationModal:setShowSearchLocationModal,
        addressLoading:addressLoading,
        setAddressLoading:setAddressLoading,
        editDeliveryAddress:editDeliveryAddress

      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
