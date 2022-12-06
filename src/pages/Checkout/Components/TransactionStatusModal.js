import React from 'react'
import Button from '../../../shared/button/button'
import { buttonTypes } from '../../../shared/button/utils'
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
          button_type={buttonTypes.success}
          button_hover_type={buttonTypes.success_hover}
          button_text="Success"
          onClick={() => updateTrasactionStatus(transactionStatusValues.SUCCESS)}
        />
        <Button
          button_type={buttonTypes.danger}
          button_hover_type={buttonTypes.danger_hover}
          button_text="Failed"
          onClick={() => updateTrasactionStatus(transactionStatusValues.FAILED)}
        />
      </div>
    </div>
  )
}
export default TransactionModal
