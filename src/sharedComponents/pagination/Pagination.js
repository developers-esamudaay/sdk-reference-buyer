import React,{useEffect, useState} from 'react'
import { usePagination, DOTS } from './usePagination'
import DropdownSvg from '../../assets/icons/Dropdown'
import styles from './Pagination.module.scss'
import { APP_COLORS } from '../../constants/colors'

export default function Pagination({ onNext, onPrevious,offset,currentPage,prevPage,nextPage }) {

  

  const rangeArray=(start,end)=>Array.from({ length: end - start + 1 }, (_, i) => start + i)
 
  console.log(prevPage,nextPage,"page")
  return (
    <div style={{display:"flex",flexDirection:"row", alignItems:"center",justifyContent:"space-around"}}>
     <div style={{marginTop:"15px",marginLeft:"0px"}}>
        <p  >
          {
          `${((currentPage-1)*offset)+1}-${currentPage*offset}  `
          }
        </p>
      </div>

      
      <div className="px-1">
        <li className={styles.page_anchor} onClick={onPrevious}>
          <div className={styles.arrow_left}>
            <DropdownSvg width="25" height="20" color={APP_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>
      {
        rangeArray(prevPage,nextPage).map((page)=>{
          return ( <div className="px-1">
     
          <div className={page===currentPage? styles.page_number:styles.page_number_inactive}>
         <p className={page===currentPage?styles.page_number_text:styles.page_number_text_inactive}>{page}</p>
          </div>
        
      </div>)
        })
      }
      

      <div className="px-1">
        <li className={styles.page_anchor} onClick={onNext}>
          <div className={styles.arrow_right}>
            <DropdownSvg width="25" height="20" color={APP_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>

    </div>
  )
}
