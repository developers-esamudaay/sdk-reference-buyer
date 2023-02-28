import React, { FC } from "react";

import styles from "./Loading.module.scss";

const Loading: FC<any> = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.dot1}></div>
        <div className={styles.dot2}></div>
        <div className={styles.dot3}></div>
        <div className={styles.dot4}></div>
      </div>
    </>
  );
};
export default Loading;
