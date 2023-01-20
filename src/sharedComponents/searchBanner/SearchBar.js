import React, { useState, useEffect, useRef, useContext } from 'react'
import searchIcon from "../../assets/images/search_icon.png"
import { search_types } from '../../constants/searchTypes'

// import { debounce } from '../../../../utils/search'

import bannerStyles from './SearchBar.module.scss'
import ErrorMessage from '../errorMessage/ErrorMessage'
import SearchIcon from '@mui/icons-material/Search'
// import { toast_actions, toast_types } from '../../../shared/toast/utils/toast'
// import { ToastContext } from '../../../../context/toastContext'

export default function SearchBar({
  handleChange,
  inlineError,
  setInlineError,
  placeholder,
  padding,
  borderRadius,
  height,


}) {
  return (

      <form className={bannerStyles.search_wrapper} style={{borderRadius:borderRadius,height:height}}>
        <input
          type="text"
       
          className={bannerStyles.input_style}
          placeholder={placeholder}

          onChange={(event) => {
            const searchValue = event.target.value
           handleChange(searchValue)

            setInlineError&& setInlineError((inlineError) => ({
              ...inlineError,
              search_error: '',
            }))
          }}
        />
        <SearchIcon/>
        </form>
      
  )
}
