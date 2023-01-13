import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const orderStatusSteps=[
    {
        status: "CREATED"
      },
      {
        status: "ACCEPTED"
      },
      {
        status: "IN-PROGRESS"
      },
      {
        status: "COMPLETED"
      },
]
const cancelOrderStatusSteps=[
  {
      status: "CREATED"
    },
    {
      status: "CANCELLED"
    },
   
]
const getStepPosition = (orderStatus) => {
    return orderStatusSteps.findIndex(({ status }) => status === orderStatus);
  };
const OrderStatusProgress=({orderStatus})=>{
  const steps=orderStatus==="CANCELLED"?cancelOrderStatusSteps:orderStatusSteps
  return(

 
    <div style={{display:"flex",justifyContent:"center",paddingTop:"20px",marginTop:"20px"}} >
    <ProgressBar
      width={"80%"}
      percent={
        100 *
          ((getStepPosition(orderStatus) ) / (steps.length - 1)) 
      }
      filledBackground="linear-gradient(to right, #41ad49, #41ad49)"
    >
      {steps.map((step, index, arr) => {
        return (
          <Step
            // position={100 * (index / arr.length)}
            transition="scale"
            children={({ accomplished }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: 25,
                  height: 25,
                  color: "gray",
                  backgroundColor: accomplished ? "green" : "gray"
                }}
              >
                <br />
                <br />
                <br />
                {step.status}
              </div>
            )}
          />
        );
      })}
    </ProgressBar>
  </div>
)}
export default OrderStatusProgress