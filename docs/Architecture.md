# Architecture

## High-level design
**Ref Bap** uses [react](https://reactjs.org/tutorial/tutorial.html) local state and context api  for global state management and data flow.
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
     ProductListing
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
  
  
  
  
