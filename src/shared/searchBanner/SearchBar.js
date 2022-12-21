import React, { useState, useEffect, useRef, useContext } from 'react'
import searchIcon from "../../assets/images/search.png"
import { search_types } from '../../constants/searchTypes'

// import { debounce } from '../../../../utils/search'

import bannerStyles from './SearchBar.module.scss'
import ErrorMessage from '../../shared/error-message/errorMessage'

// import { toast_actions, toast_types } from '../../../shared/toast/utils/toast'
// import { ToastContext } from '../../../../context/toastContext'

export default function SearchBar({
  search,
  setSearch,
  checkSearch,
  inlineError,
  setInlineError,
  placeholder,
  padding,
}) {
  return (
    <div class={bannerStyles.wrap}>
      <form>
        <input
          type="text"
          autoFocus
          style={{padding:padding,backgroundColor:"white",width:"300px"}}
          placeholder={placeholder}
          onChange={(event) => {
            const searchValue = event.target.value
            setSearch((search) => ({
              
              value: searchValue,
            }))

            setInlineError&& setInlineError((inlineError) => ({
              ...inlineError,
              search_error: '',
            }))
          }}
        />
        </form>
        <div >
        <img src={searchIcon} width={"40px"}/>
        </div>
     
      {inlineError&&inlineError?.search_error && <ErrorMessage>{inlineError.search_error}</ErrorMessage>}
    </div>
  )
}
