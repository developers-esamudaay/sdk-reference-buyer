import SearchIcon from "@mui/icons-material/Search";
import styles from "styles/home/HomePage.module.scss";
import { useHistory } from "react-router-dom";
const SearchKeyWordSuggetion = ({
    productKeySuggetions,
    showSuggetions,
    debounceSearchTrem,
    setSearchKeyword,
    setShowSuggetions,
    setIsSearching,
    businessSearchSuggetions,
    setBusinessSearchSuggetions
  }: any) => {
    const history=useHistory()
    console.log(showSuggetions, debounceSearchTrem,productKeySuggetions);
  
    return (
      <>
        {showSuggetions && debounceSearchTrem && (
          <div className={styles.product_suggetion_wrapper}>
            {
              productKeySuggetions.length>0&&    <p className={styles.search_category_text} >Products</p>
            }
            
        
            {productKeySuggetions?.map((suggetion: any) => {
              return (
                <div
                  className={styles.product_suggetion}
                  key={suggetion?.key}
                  onClick={() => {
                    console.log('in click')
                    setSearchKeyword(suggetion?.key);
                    setIsSearching(false)
                  }}
                >
                  <SearchIcon height="20px" width="20px" />
                  <p className={styles.suggetion_text}>{suggetion?.key}</p>
                </div>
              );
            })}
              {
              businessSearchSuggetions.length>0&&    <p className={styles.search_category_text} >
              businesses
            </p>
            }
            
            {businessSearchSuggetions?.map((suggetion: any) => {
              return (
                <div
                  className={styles.product_suggetion}
                  key={suggetion?.id}
                  onClick={() => {
                  history.push(`/business/${suggetion?.id}`)
                  }}
                >
                  <SearchIcon height="20px" width="20px" />
                  <p className={styles.suggetion_text}>{suggetion?.name}</p>
                </div>
              );
            })}
  
          </div>
        )}
      </>
    );
  };
  export default SearchKeyWordSuggetion