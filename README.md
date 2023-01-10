<h1 align="center">Reference Buyer Web App</h1>

Reference Buyer Web App is an ecommerce app like amazon/flipkart developed using  <a href="https://docs.google.com/document/d/17bY8DS981WyqDhh790SVAMhbJylVl_LH4r-5uXZ1yOk/edit
">ondc buyer sdk </a>. This app has basic modules like cart, producList, Orders,businessProfile. If you want to make your own ondc buyer app you can directly clone and customize it according to your usecase

## Technology Stack

### Components
* CSS: Styling web pages, html files
* Javascript: Primary programing language
* ReactJS: Javascript library for building User Interfaces
* styled-components: CSS-in-JS library
* firestore
*firbase-cloud-function

## Requirements
* node 
* yarn 


## Local Installation
### Steps
* `git clone <repository-url>` , where `<repository-url>` is the link to the forked repository
* `cd sdk-reference-buyer`

**Note :** If you want to contribute, first fork the original repository and clone the forked repository into your local machine followed by ```cd``` into the directory
```sh
git clone (https://github.com/developers-esamudaay/sdk-reference-buyer.git)

```
```sh
cd sdk-reference-buyer


```
* Install all the dependencies with `yarn install`

*  <a href="https://firebase.google.com/docs/firestore/quickstart"> setup cloud firestore </a>
* To Get Apid please folllow step written in <a href="https://docs.google.com/document/d/17bY8DS981WyqDhh790SVAMhbJylVl_LH4r-5uXZ1yOk/edit">ondc buyer sdk docs </a> (step 3 page 5 to 9)
* create a new .env file in root folder 
```sh
REACT_APP_API_ID=<YOUR APID>

````
* To get Firebase config of your project please check <a href="https://support.google.com/firebase/answer/7015592?hl=en#web&zippy=%2Cin-this-article"> firebse docs</a>
* Go src-> data-> firebase_init and replace firebaseConfig with your own firebase config
* Create Firestore collection with exact same name ondcCatalog, ondcOrder, ondcOrder,ondcCart,ondcProducts
* <a href="https://firebase.google.com/docs/functions/get-started"> setup firebase cloud function </a>
* deloy cloud function with script available in firbaseCloudFunction file 

* path for script src->cloudFunction.js
* Start the server with `yarn start`
* Visit your app at [http://localhost:3000](http://localhost:3000).
