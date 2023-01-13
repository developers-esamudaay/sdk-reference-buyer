import {useState,useEffect,useContext} from "react"
import styles from "./LocationSearchModal.module.scss"
import SearchBar from "../searchBanner/SearchBar"
import { getLocationSuggetion } from "../../data/apiCall"
import { AddressContext } from "../../contextProviders/addressContextProvider"
import CrossIcon from "../../assets/icons/CrossIcon"
import { debouncedFunction } from "../../commonUtils"
const LocationSearchModal=()=>{
    const [searchTerm,setSearchTerm]=useState({value:""})
    const [locatioSearchSuggetions,setLocationSearchSuggetions]=useState([])
    const [suggetionsLoading,setSuggetionsLoading]=useState(false)
    const {currentLocation,setCurrentLocation,showSearchLocationModal,setShowSearchLocationModal}=useContext(AddressContext)
    const onSelecteLocation=(location)=>{
        setSuggetionsLoading(true)
        setShowSearchLocationModal(false)
          setCurrentLocation({lat:location?.lat??0.00,lon:location?.lon??0.00})
          setSuggetionsLoading(false)
    }
    console.log(locatioSearchSuggetions)
    const fetchLocationSuggestion=async(value)=>{
        console.log(value)
        const response= await getLocationSuggetion(value);
        console.log(response)
       
       setLocationSearchSuggetions(response.data)
    }
  
   
   
    return (
        <div className={styles.overlay}>
         <div className={styles.popup_card}>
         <div  style={{display:"flex",justifyContent:"flex-end",marginTop:"10px",marginRight:"10px",cursor:"pointer"}} onClick={()=>setShowSearchLocationModal(false)}>
                <CrossIcon width={"30px"} height={"30px"} color={"black"} />
             </div>
            <div className={styles.content}>
            
            <SearchBar handleChange={debouncedFunction(fetchLocationSuggestion,1000)} placeholder={"search your location"} padding={"10px"}/>
            <div style={{marginTop:"30px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer"}}>
            {
            
                locatioSearchSuggetions?.map((searchItem)=>{
                    return (
                        <div key={searchItem?.place_id} style={{width:"65%",marginTop:"15px"}} onClick={()=>onSelecteLocation(searchItem)}>
                        <p>{searchItem.display_name}</p>
                        </div>
                    )
                })
            }
            </div>
            </div>
         </div>
        </div>
    )
}
export default LocationSearchModal