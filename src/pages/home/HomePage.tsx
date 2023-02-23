import React from "react";
import { useContext, useEffect, useState } from "react";

import {
  CartContext,
  CartInterface,
} from "../../contextProviders/cartContextProvider";
import { debouncedFunction } from "../../commonUtils";
import {
  getProducts,
  addProducts,
  getAllBusiness,
  addKeys,
  addUpdatedBusiness,
  getProductKeySuggetion,
  getBusinessSuggetion,
  addBusinessKeys,
} from "../../data/firbaseCalls";
// import CartInfo from '../cart/Components/CartInfo'
import { isEmptyObject } from "../../commonUtils";
import ProductList from "pages/ProductListing/ProductList";
import Navbar from "sharedComponents/navBar/Navbar";
import { AddressContext } from "contextProviders/addressContextProvider";
import LocationSearchModal from "sharedComponents/locationSearch/LocationSearchModal";
import { Product } from "interfaces/ResponseInterfaces";
import { CartDataInterface } from "interfaces/CartInterface";
import { LanTwoTone } from "@mui/icons-material";
import useDebounce from "customHooks/useDebounce";
import SearchKeyWordSuggetion from "./SearchSuggetion";
type ProductKeySuggetions = {
  key: string;
  searchIndexes: string[];
};


const Homepage = () => {
  const [products, setProducts] = useState<Product[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const debounceSearchTrem: string = useDebounce(searchTerm, 500);
  const [productKeySuggetions, setProductKeySuggetions] = useState<
    string[] | []
  >([]);
  const [businessSearchSuggetions,setBusinessSearchSuggetions]=useState([])
  const [showSuggetions, setShowSuggetions] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

console.log(searchKeyword)
  useEffect(() => {
    (async () => {
      if (debounceSearchTrem) {
        setIsSearching(true);
        const productSuggetions: string[] = await getProductKeySuggetion(
          debounceSearchTrem
        );
         const businessSuggetion:any=await getBusinessSuggetion(debounceSearchTrem)
         console.log(productSuggetions,businessSuggetion)
        setShowSuggetions(true);
    
        setProductKeySuggetions(productSuggetions);
        setBusinessSearchSuggetions(businessSuggetion)

      }
    })();
  }, [debounceSearchTrem]);

  const { cartData, showCartInfo, setShowCartInfo } =
    useContext<CartInterface>(CartContext);

  const [firstProduct, setFirstProduct] = useState("");
  const {
    currentAddress,
    setCurrentAddress,
    currentLocation,
    setCurrentLocation,
    showSearchLocationModal,
    setShowSearchLocationModal,
    addressLoading,
  } = useContext(AddressContext);

  const cartItems = cartData?.items;
  const onBlur = () => {
    console.log("test")
     setTimeout(()=>{setShowSuggetions(false)},500)
  };
  const onFocus = () => {
    setShowSuggetions(true);
  };
  // useEffect(() => {
  //   (async () => {
  //     const allBusiness = await getAllBusiness();

  //     const mySet1 = new Set();
  //     for (let business of allBusiness) {
  //       if (!isEmptyObject(business)&& business?.business_id!=="35") {
  //         const businessImages = business?.business_data?.images ?? [];
  //         const businessImageUrl =
  //           (Array.isArray(businessImages?.images) &&
  //             businessImages?.images.length > 0 &&
  //             businessImages?.images[0]) ??
  //           "";
  //         const locations = business?.business_data?.locations ?? [];
  //         const location_details =
  //           (Array.isArray(locations) &&
  //             locations.length > 0 &&
  //             locations[0]) ??
  //           {};
  //         const locationAddress = {
  //           door: location_details?.address?.street??"",

  //           city: location_details?.address?.city??"",
  //           state: location_details?.address?.state??"",
  //           country: location_details?.address?.country??"",
  //           areaCode: location_details?.address?.area_code??"",
  //         };
  //          const businessNameKeys= business?.business_data?.name.split(" ")
  //          let searchIndexes=[];
  //           for(let i=0;i<Math.min(4,businessNameKeys.length);i++){

  //             let searchIndex=""
  //             for(let j=0;j<businessNameKeys[i].length;j++){
  //               searchIndex=searchIndex+businessNameKeys[i][j]
  //               console.log(searchIndex)
  //               searchIndexes.push(searchIndex)
  //             }
  //           }
    //           await addBusinessKeys(business?.business_id,business?.business_data?.name,searchIndexes)
  //         const businessObj = {
  //           bpp_id: business?.bpp_id,
  //           bpp_uri: business?.bpp_uri,
  //           business_name: business?.business_data?.name,
  //           business_id: business?.business_id,
  //           locations_details: {
  //             address: locationAddress,
  //             location: {
  //               lat: location_details?.lat??0.00,
  //               lon: location_details?.lon??0.00,
  //               delivery_radius: location_details?.delivery_radius?.radius??0,
  //             },
  //           },

  //           businessImageUrl: businessImageUrl,
  //         };
  //         await addUpdatedBusiness(businessObj);
  //         const businessItems = business?.business_data?.items ?? [];

  //         for (let item of business?.business_data?.items ?? []) {
  //           let product_short_name = "";
  //           const keys = item?.item_name.split(" ")??[];
  //           const newKeys=keys.map((key)=>key.toLowerCase())
  //           console.log(keys);
  //           console.log(Math.min(keys.length, 5));
  //           for (let i = 0; i < Math.min(keys.length, 4); i++) {
  //             product_short_name = product_short_name + " " + keys[i];
  //             await addKeys(keys[i]);
  //           }


  //           console.log(product_short_name);
  //           const locations = business?.business_data?.locations ?? [];
  //           const imageUrl =
  //             (item?.images &&
  //               Array.isArray(item?.images) &&
  //               item?.images.length > 0 &&
  //               item?.images[0]) ??
  //             "";
  //           const location = {
  //             delivery_redius:
  //               (locations.length > 0 && locations[0]?.delivery_radius?.radius) ?? 0,
  //             lat: locations.length > 0 ? locations[0]?.lat : 0.0,
  //             lon: locations.length > 0 ? locations[0]?.lon : 0.0,
  //           };

  //           const unique_id = item.id + "_" + business?.business_id;
  //           const product = {
  //             item_id: item.id??"",
  //             bpp_id: business?.bpp_id??"",
  //             bpp_uri: business?.bpp_uri??"",
  //             location: location,
  //             business_id: business?.business_id??"",
  //             business_name: business?.business_data?.name??"",
  //             product_name: product_short_name??"",
  //             poduct_name_indexes: newKeys,
  //             price: (item?.price / 100).toFixed(0)??0,
  //             imageUrl: imageUrl??"",
  //             location_id: item?.location_id??"",
  //             business_location_ids: locations?.map(
  //               (location: any) => location.id
  //             )??[],
  //             city_code: business?.descriptor?.city_code??"",
  //             unique_id: unique_id??"",
  //           };

  //           console.log(item);
  //           if (!mySet1.has(unique_id)) {
  //             mySet1.add(unique_id);

  //             await addProducts(
  //               product,
  //               {
  //                 ...item,
  //                 bpp_id: business?.bpp_id??"",
  //                 bpp_uri: business?.bpp_uri??"",
  //                 location: location,
  //                 imageUrl: imageUrl??"",
  //                 business_id: business?.business_id??"",
  //                 business_name: business?.business_data?.name??"",
  //                 city_code: business?.descriptor?.city_code??"",
  //                 business_location_ids: locations?.map(
  //               (location: any) => location.id
  //             )??[]},
  //               unique_id??""
  //             );
  //           }
  //         }
  //       }
  //     }
  //   })();
  // }, []);

  // use this function to fetch products

  //using IIFE

  //fetch products with search query
  //   const fetchQueryProducts = async (value: string) => {
  //     console.log(value);
  //     if (!value && !isAlreadySearched) {
  //       return;
  //     }
  //     if (value && value.length < 3) {
  //       if (isAlreadySearched) {
  //         await fetchProducts(QueryTypes.NO_QUERY, "");
  //         setIsAlreadySearched(false);
  //       }
  //       if (!isAlreadySearched)
  //         setInlineError(
  //           (error) => `please enter atleast 3 letter to activate search`
  //         );
  //     } else {
  //       setInlineError("");
  //       //debouncing fetch function is remaining forthis search call
  //       await fetchProducts(QueryTypes.SEARCH_QUERY, value);
  //       setIsAlreadySearched(true);
  //     }
  //   };

  return (
    <React.Fragment>
      {/* <Navbar /> */}
      <Navbar
        handleChange={setSearchTerm}
        currentAddress={currentAddress}
        addressLoading={addressLoading ?? false}
        setShowSearchLocationModal={setShowSearchLocationModal}
        fromProductPage
        onBlur={onBlur}
        onFocus={onFocus}
        searchKeyword={searchKeyword}
        searchTerm={searchTerm}
        isSearching={isSearching}
        setSearchKeyword={setSearchKeyword}
        
        
      />
      <SearchKeyWordSuggetion
        productKeySuggetions={productKeySuggetions}
        showSuggetions={showSuggetions}
        debounceSearchTrem={debounceSearchTrem}
        setSearchKeyword={setSearchKeyword}
        setShowSuggetions={setShowSuggetions}
        setIsSearching={setIsSearching}
        setBusinessSearchSuggetions={setBusinessSearchSuggetions}
        businessSearchSuggetions={businessSearchSuggetions}
        
      />
      <div className={"container"}>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 p-2">
            <ProductList searchKeyword={searchKeyword} />
          </div>
        </div>
      </div>

      {showSearchLocationModal && <LocationSearchModal />}

      {/* show cart modal  */}
    </React.Fragment>
  );
};
export default Homepage;
