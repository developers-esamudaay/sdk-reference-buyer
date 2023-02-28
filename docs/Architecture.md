




## Folder Structure
```
src
  asstets 
      icons
      images
  constants
  contextProviders
  data
  pages
     businessPage
     cart
     checkout 
     orders 
     home
     productListing
  styles
  App.js
  index.js
  commonUtils.js
  cloudFunction.js
  
  ```
  
  * `asstes` - this consist image and icons
  * `constants` - all constant files 
  *  `contextProvider` - this consist two provider 
      1 cartContextProvider : this consist all cart related functiolnality required throghout app
      2 addressContextProvider: this consist current location and curent address related functionalities
  * `data` - this consist apiCall and firebaseCall
           apiCall has all api provided by ondc buyer sdk 
           firebaseCall has all function to get data from firestore call
  * styles - this folder has style for each component in pages folder
  * pages - 
     * businessPage: this page show all info about a particular business
     *  cart : this page shoow all available items in cart or you can add or remove item from cart
     *  checkout:checkout consist 3 steps 1 Address Fill 2 Check Order Summary with all extra charges 3 Payment
     
        
     
  
  
  
  
