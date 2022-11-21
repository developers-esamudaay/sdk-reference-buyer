import { useState } from 'react'
import styles from './ExpededView.module.scss'
const ExpededView = ({ children, header, subheader, shouldExpendedInitially }) => {
  const [isExpended, setIsExpeded] = useState(shouldExpendedInitially)
  return (
    <>
      <div className={styles.expeded_view}>
        <div onClick={() => setIsExpeded(true)}>
          <p className={styles.header}> {header}</p>
          <p className={styles.subHeader}>{subheader}</p>
        </div>
      </div>
      <div onClick={() => setIsExpeded(false)}>{isExpended && children}</div>
    </>
  )
}
export default ExpededView
