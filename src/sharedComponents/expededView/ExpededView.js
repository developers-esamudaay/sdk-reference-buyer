import { useState } from 'react'
import styles from './ExpededView.module.scss'
import DropdownSvg from '../../assets/icons/Dropdown'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const ExpededView = ({ children, header, subheader, shouldExpendedInitially,Icon }) => {
  const [isExpended, setIsExpeded] = useState(shouldExpendedInitially)
  return (
    <>
      <div className={styles.expeded_view} onClick={() => setIsExpeded((prev) => !prev)}>
        <p className={styles.header}> <span style={{marginRight:"20px",marginTop:"10px"}}><Icon style={{color:"#1c75bc"}}/></span>{header}</p>
        <div
       
        >
         {isExpended?<RemoveIcon/>:<AddIcon/>}
        </div>
      </div>
      <div className={isExpended?styles.content_open:styles.content}>{isExpended && children}</div>
    </>
  )
}
export default ExpededView
