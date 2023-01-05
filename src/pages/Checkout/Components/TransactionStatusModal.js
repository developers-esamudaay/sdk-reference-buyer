import React from 'react'
import Button from '../../../sharedComponents/button/Button'
import { APP_COLORS } from '../../../constants/colors'
import { transactionStatusValues } from '../../../constants/transactionStatus'
const TransactionModal = ({ updateTrasactionStatus }) => {
  return (
    <div
      style={{
        position: 'fixed',
        height: '40%',
        width: '30%',
        top: '30%',
        left: '35%',
        backgroundColor: '#002b80',
        border: ` 1px solid   #002b80 `,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p
        style={{
          color: 'white',
        }}
      >
        Please select a transaction Status
      </p>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <Button
           btnBackColor={APP_COLORS.WHITE}
           hoverBackColor={APP_COLORS.ACCENTCOLOR}
           buttonTextColor={APP_COLORS.ACCENTCOLOR}
           hoverTextColor={APP_COLORS.WHITE}
          button_text="Success"
          onClick={() => updateTrasactionStatus(transactionStatusValues.SUCCESS)}
        />
        <Button
            btnBackColor={APP_COLORS.WHITE}
            hoverBackColor={APP_COLORS.ACCENTCOLOR}
            buttonTextColor={APP_COLORS.ACCENTCOLOR}
            hoverTextColor={APP_COLORS.WHITE}
          button_text="Failed"
          onClick={() => updateTrasactionStatus(transactionStatusValues.FAILED)}
        />
      </div>
    </div>
  )
}
export default TransactionModal
