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
})

export const AddressContextProvider = ({ children }) => {
  const [deliveryAddresses, setDeliveryAddresses] = useState(
    JSON.parse(localStorage.getItem('deliveraddresses')) || [],
  )
  const [billingAddresses, setBillingAddresses] = useState(
    JSON.parse(localStorage.getItem('billingAddresses')) || [],
  )

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState({})
  const [selectedBillingAddress, setSelectedBillingAddress] = useState({})
  console.log(deliveryAddresses)
  const addNewBillingAddresses = (newAddress) => {
    setBillingAddresses((prev) => [...prev, newAddress])
  }
  const addNewDeliveryAddresses = (newAddress) => {
    console.log('add new delivery Address')
    setDeliveryAddresses((prev) => {
      return [...prev, newAddress]
    })
  }
  useEffect(() => {
    console.log('save in cookie')
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
      }}
    >
      {children}
    </AddressContext.Provider>
  )
}
