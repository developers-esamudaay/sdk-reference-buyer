import React from 'react'
import { usePagination, DOTS } from './usePagination'
import DropdownSvg from '../svg/dropdonw'
import styles from './pagination.module.scss'
import { ONDC_COLORS } from '../colors'

export default function Pagination({ onNext, onPrevious }) {
  return (
    <ul className={`d-flex align-items-center`}>
      <div className="px-1">
        <li className={styles.page_anchor} onClick={onPrevious}>
          <div className={styles.arrow_left}>
            <DropdownSvg width="25" height="20" color={ONDC_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>

      <div className="px-1">
        <li className={styles.page_anchor} onClick={onNext}>
          <div className={styles.arrow_right}>
            <DropdownSvg width="20" height="16" color={ONDC_COLORS.ACCENTCOLOR} />
          </div>
        </li>
      </div>
    </ul>
  )
}
