import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useState } from 'react'
export const msgPosition={
     TOP_RIGHT:toast.POSITION.TOP_RIGHT,
     TOP_LEFT:toast.POSITION.TOP_LEFT,
     BOTTOM_RIGHT:toast.POSITION.BOTTOM_RIGHT,
    BOTTOM_LEFT:toast.POSITION.BOTTOM_LEFT,
}
export const showSuccessMsg=({position,msg})=>{
    console.log("show success")
    toast.success(msg,{position})
}
 export const showErrorMsg=({position,msg})=>{
    console.log(msg,"in error")
    toast.error(msg,{position})
}
export  const showWarningMsg=({position,msg})=>{
    toast.warning(msg,{position})
}
const showInfoMsg=({position,msg})=>{
    toast.info(msg,{position})
}
const ToastMessegeProvider=({children})=>{
  
    
   
   
    return (
      
            <>
            <ToastContainer/>
         {children}
         </>

    )
   
}
export default ToastMessegeProvider;