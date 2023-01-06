import React from 'react'
import { usePagination, DOTS } from './usePagination'
import DropdownSvg from '../../assets/icons/Dropdown'
import styles from './Pagination.module.scss'
import { APP_COLORS } from '../../constants/colors'

export default function Pagination({ onNext, onPrevious }) {
  return (
    <ul className={`d-flex align-items-center`}>
      <div className="px-1">
        <li className={styles.page_anchor} onClick={onPrevious}>
          <div className={styles.arrow_left}>
            <DropdownSvg width="25" height="20" color={APP_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>

      <div className="px-1">
        <li className={styles.page_anchor} onClick={onNext}>
          <div className={styles.arrow_right}>
            <DropdownSvg width="25" height="20" color={APP_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>
    </ul>
  )
}
