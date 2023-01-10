import { createContext, useState, useEffect } from 'react'

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
