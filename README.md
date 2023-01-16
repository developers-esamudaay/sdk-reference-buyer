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
* firbase-cloud-function

## Architecture

 ###High Level Design

**Ref Bap** uses [react](https://reactjs.org/tutorial/tutorial.html) local state and context api  for global state management and data flow.


** here is the diagram for data flow
![alt text](https://lucid.app/publicSegments/view/276372b5-7898-4ca9-b0c0-be4f5b121061/image.png)
 

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
