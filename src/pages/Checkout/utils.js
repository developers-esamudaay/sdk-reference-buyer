import { checkoutSteps } from '../../constants/checkoutSteps'
export function getCurrentStep(step_id) {
  
  switch (step_id) {
    case checkoutSteps.SELECT_ADDRESS:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 1,
      }

    case checkoutSteps.CART_STATUS:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 2,
      }

    case checkoutSteps.SELECT_PAYMENT_METHOD:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 3,
      }

    default:
      return {
        current_active_step_id: step_id,
        current_active_step_number: 1,
      }
  }
}
