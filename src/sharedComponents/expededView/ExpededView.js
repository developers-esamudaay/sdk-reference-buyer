import { useState } from 'react'
import styles from './ExpededView.module.scss'
import DropdownSvg from '../../assets/icons/Dropdown'
const ExpededView = ({ children, header, subheader, shouldExpendedInitially }) => {
  const [isExpended, setIsExpeded] = useState(shouldExpendedInitially)
  return (
    <>
      <div className={styles.expeded_view} onClick={() => setIsExpeded((prev) => !prev)}>
        <p className={styles.header}> {header}</p>
        <div
          style={
            isExpended
              ? {
                  transform: 'rotate(180deg)',
                  transition: 'all 0.7s',
                }
              : { transform: 'rotate(0)', transition: 'all 0.7s' }
          }
        >
          <DropdownSvg />
        </div>
      </div>
      <div>{isExpended && children}</div>
    </>
  )
}
export default ExpededView
