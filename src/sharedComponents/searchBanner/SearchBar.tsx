import React, { useState, useEffect, useRef, useContext } from "react";
import searchIcon from "../../assets/images/search_icon.png";

import bannerStyles from "./SearchBar.module.scss";
import ErrorMessage from "../errorMessage/ErrorMessage";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  handleChange: Function|null;
  inlineError?: string;
  placeholder: string;
  padding?: string;
  borderRadius?: string;
  height?: string;
};
const SearchBar: React.FC<SearchBarProps> = ({
  handleChange,
  inlineError,

  placeholder,
  padding,
  borderRadius,
  height,
}) => {
  return (
    <form
      className={bannerStyles.search_wrapper}
      style={{ borderRadius: borderRadius, height: height }}
    >
      <input
        type="text"
        className={bannerStyles.input_style}
        placeholder={placeholder}
        onChange={(event) => {
          const searchValue = event.target.value;
          handleChange&& handleChange(searchValue);
        }}
      />
      <SearchIcon style={{ width: "30px", height: "18px", color: "#f86c08" }} />
    </form>
  );
};
export default SearchBar;
