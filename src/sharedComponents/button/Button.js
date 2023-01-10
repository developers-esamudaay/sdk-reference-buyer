import React, { useState } from 'react'

import Loading from '../loading/Loading'
import styles from './Button.module.scss'



export default function Button(props) {
 const  {hoverBackColor,btnBackColor,btnBorder,hoverTextColor,buttonTextColor}=props
  let buttonProps = {}
  const[hover,setHover]=useState(false)
  if (!props.disabled) {
    buttonProps = {
      ...buttonProps,
      onMouseOver: () =>{ console.log("test");setHover((prev)=>!prev)},
      onMouseOut: () => setHover((prev)=>!prev),
    }
  }
  console.log(hover)
  const loading = (
    <div className="d-flex align-items-center justify-content-center">
      <Loading backgroundColor={buttonTextColor} />
    </div>
  )
  return (
    <button className={styles.btn} style={{
      backgroundColor:hover?hoverBackColor:btnBackColor,
      border:btnBorder??""
      
      


     }} {...buttonProps} {...props}>
      {props.isloading === 1 ? (
        loading
      ) : (
        <p className={styles.button_text} style={{ color: hover?hoverTextColor:buttonTextColor }}>
          {props.button_text}
        </p>
      )}
    </button>
  )
}
