import React, { useState, useEffect, useRef, useContext } from 'react'

import { search_types } from '../../../../src/constants/searchTypes'

// import { debounce } from '../../../../utils/search'

import bannerStyles from '../../../../src/styles/products/productList.module.scss'
import ErrorMessage from '../../../shared/error-message/errorMessage'

// import { toast_actions, toast_types } from '../../../shared/toast/utils/toast'
// import { ToastContext } from '../../../../context/toastContext'

export default function SearchBanner({
  search,
  setSearch,
  checkSearch,
  inlineError,
  setInlineError,
}) {
  return (
    <div class={bannerStyles.wrap}>
      <div class={bannerStyles.search}>
        <input
          type="text"
          class={bannerStyles.searchTerm}
          placeholder="What are you looking for?"
          onChange={(event) => {
            const searchValue = event.target.value
            setSearch((search) => ({
              ...search,
              value: searchValue,
            }))

            setInlineError((inlineError) => ({
              ...inlineError,
              search_error: '',
            }))
          }}
        />
        <button styles={bannerStyles.searchButton}>search</button>
      </div>
      {inlineError.search_error && <ErrorMessage>{inlineError.search_error}</ErrorMessage>}
    </div>
  )
}
