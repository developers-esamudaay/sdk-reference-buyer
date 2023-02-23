import { ToastContainer, toast, Slide, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createContext, ReactNode, useState } from "react";
import React, { FC } from "react";
export const msgPosition = {
  TOP_RIGHT: toast.POSITION.TOP_RIGHT,
  TOP_LEFT: toast.POSITION.TOP_LEFT,
  BOTTOM_RIGHT: toast.POSITION.BOTTOM_RIGHT,
  BOTTOM_LEFT: toast.POSITION.BOTTOM_LEFT,
};
type Input = {
  position: ToastPosition;
  msg: String;
};
export const showSuccessMsg = ({ position, msg }: Input) => {
  toast.success(msg, { position });
};
export const showErrorMsg = ({ position, msg }: Input) => {
  console.log(msg, "in error");
  toast.error(msg, { position });
};
export const showWarningMsg = ({ position, msg }: Input) => {
  toast.warning(msg, { position });
};
const showInfoMsg = ({ position, msg }: Input) => {
  toast.info(msg, { position });
};
type Props = {
  children: string | JSX.Element | JSX.Element[];
};
const ToastMessegeProvider: FC<Props> = ({ children }) => {
  return (
    <>
      <ToastContainer hideProgressBar={true} autoClose={1000} draggable />
      {children}
    </>
  );
};
export default ToastMessegeProvider;
