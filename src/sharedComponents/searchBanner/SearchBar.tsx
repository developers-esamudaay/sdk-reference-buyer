import React, { useState, useEffect, useRef, useContext } from "react";
import searchIcon from "../../assets/images/search_icon.png";

import bannerStyles from "./SearchBar.module.scss";
import ErrorMessage from "../errorMessage/ErrorMessage";
import SearchIcon from "@mui/icons-material/Search";
import CrossIcon from "../../assets/icons/CrossIcon";
type SearchBarProps = {
  handleChange: Function | null;
  inlineError?: string;
  placeholder: string;
  padding?: string;
  borderRadius?: string;
  height?: string;
  handleBlur?: () => void;
  handleFocus?: () => void;
  searchKeyword?: string;
  searchTerm?: string;
  isSearching?: boolean;
  setSearchKeyword?: React.Dispatch<React.SetStateAction<string>>;
  
};
const SearchBar: React.FC<SearchBarProps> = ({
  handleChange,
  inlineError,
  handleBlur,
  placeholder,
  padding,
  borderRadius,
  height,
  handleFocus,
  searchKeyword = "",
  searchTerm,
  isSearching,
  setSearchKeyword,
}) => {
  console.log(searchKeyword);
  return (
    <form
      className={bannerStyles.search_wrapper}
      style={{ borderRadius: borderRadius, height: height }}
    >
      <input
        type="text"
        className={bannerStyles.input_style}
        value={isSearching ? searchTerm : searchKeyword}
        placeholder={placeholder}
        onChange={(event) => {
          const searchValue = event.target.value;
          handleChange && handleChange(searchValue);
        }}
        onBlur={() => handleBlur && handleBlur()}
        onFocus={() => handleFocus && handleFocus()}
      />
      {!isSearching && !searchKeyword ? (
        <SearchIcon />
      ) : (
        <div
          onClick={() => {
            console.log("search_cancelled");
            setSearchKeyword && setSearchKeyword("");
          }}
        >
          <CrossIcon />
        </div>
      )}
    </form>
  );
};
export default SearchBar;
