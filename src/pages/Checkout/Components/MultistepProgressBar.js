import React from "react";
import styles from  "../../../styles/checkout/MultiStepProgressBar.module.scss";
import { ProgressBar, Step } from "react-step-progress-bar";
import OrderSummary from "./OrderSummary";
import {CheckoutSteps} from "../Checkout"
const MultiStepProgressBar = ({ currentActiveStep,setCurrentActiveStep}) => {
   const totalSteps=CheckoutSteps.length;
   const percentCompleted=((currentActiveStep)/(totalSteps))*100
  return (
    <ProgressBar percent={percentCompleted}  filledBackground="green">
      {
        CheckoutSteps.map((step,index)=>{
            return (
                <Step
                // position={100 * (index / arr.length)}
               
                children={({ accomplished}) => (
                  <div
                   className={`${styles.indexedStep} ${accomplished?styles.accomplished:null}`} 
                   onClick={()=>setCurrentActiveStep(index+1)}
                  >
                    <span>{`${step.stepNumber}.   `}</span>
                    {step.name}

                   
                  </div>
                )}
              />
            )
        })
      }
      
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
