import {useState,useEffect,useContext} from "react"
import styles from "./LocationSearchModal.module.scss"
import SearchBar from "../searchBanner/SearchBar"
import { getLocationSuggetion } from "../../data/apiCall"
import { AddressContext } from "../../contextProviders/addressContextProvider"
import CrossIcon from "../../assets/icons/CrossIcon"
import { debouncedFunction } from "../../commonUtils"
import PlaceIcon from '@mui/icons-material/Place';
import MapView from "../mapView/MapView"
const LocationSearchModal=()=>{
    const [searchTerm,setSearchTerm]=useState({value:""})
    const [locatioSearchSuggetions,setLocationSearchSuggetions]=useState([])
    const [suggetionsLoading,setSuggetionsLoading]=useState(false)
    const {currentLocation,setCurrentLocation,showSearchLocationModal,setShowSearchLocationModal,currentAddress}=useContext(AddressContext)
    const [showLocationSuggetion ,setShowLocationSuggestion]=useState(false)
    console.log(currentAddress)
    const onSelecteLocation=(address)=>{
   
          setShowLocationSuggestion(false)
          setCurrentLocation({lat:address?.location?.lat??0.00,lon:address?.location?.lon??0.00})
         
    }
    const userCurrentLocation={
        latitude:currentLocation?.lat,
        longitude:currentLocation?.lon
    }
    useEffect(()=>{
          if(locatioSearchSuggetions&&Array.isArray(locatioSearchSuggetions)&&locatioSearchSuggetions.length>0){
            setShowLocationSuggestion(true)
          }
    },[locatioSearchSuggetions])
    console.log(locatioSearchSuggetions)
    const fetchLocationSuggestion=async(value)=>{
        console.log(value)
        const response= await getLocationSuggetion(value);
        console.log(response)
        const searchSuggetions=response.data.map((item)=>{
            const splitedText=item?.display_name.split(",")
            return {
                firstText:Array.isArray(splitedText)&&splitedText.length>0&&splitedText[0],
                secondText:Array.isArray(splitedText)&&splitedText.length>0&&splitedText.slice(1).join(","),
                location:{
                    lat:item?.lat,
                    lon:item?.lon
                }
            }
        })
       
       setLocationSearchSuggetions(searchSuggetions)
    }
  
   
   
    return (
        <div className={styles.overlay}>
         <div className={styles.popup_card}>
         <div  style={{display:"flex",justifyContent:"flex-end",marginTop:"10px",marginRight:"10px",cursor:"pointer"}} onClick={()=>setShowSearchLocationModal(false)}>
                <CrossIcon width={"30px"} height={"30px"} color={"black"} />
             </div>
            <div className={styles.content}>
            <div className={styles.map_container}>
            <MapView location={currentLocation} zoom={8}/>
            </div>
            <div className={styles.current_address_wrapper}>
                <p className={styles.address_header}>Address</p>
             <p className={styles.address_text}>{currentAddress?.pretty_address_text}</p>
             <div className={styles.confirm_button_container}>
                         <button className={styles.confirm_button} onClick={()=>setShowSearchLocationModal(false)} >
                         Save This Address
                         </button>
                         </div>
            </div>
            <div style={{width:"55%"}}>
                <div style={{position:"absolute",top:"90px",zIndex:"2000"}}>
            
            <SearchBar handleChange={debouncedFunction(fetchLocationSuggestion,1000)} placeholder={"search your location"}  borderRadius="0px" height="50px"/>
            </div>
            </div>
        
      

          
            <div style={{zIndex:"2000",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",position:"absolute",top:"140px",backgroundColor:"white",}}>
            {
                showLocationSuggetion?locatioSearchSuggetions?.map((searchItem)=>{
                    return (
                        <div key={searchItem?.place_id} style={{width:"90%",marginTop:"15px",display:"flex",justifyContent:"space-between" }} onClick={()=>onSelecteLocation(searchItem)}>
                            <PlaceIcon style={{color:"#f86c08"}}/>
                            <div  style={{width:"270px",marginLeft:"15px",borderBottom:"1px solid gray"}}>
                        <p className={styles.first_text}>{searchItem.firstText}</p>
                        <p className={styles.second_text}>{searchItem.secondText}</p>
                        </div>
                        </div>
                    )
                }):null
            }

            </div>
            </div>
         </div>
        </div>
    )
}
export default LocationSearchModal