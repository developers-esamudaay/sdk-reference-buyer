import React from "react";
import { APP_COLORS } from "../../constants/colors";
import styles from "./Loading.module.scss";

export default function Loading(props) {
  const { backgroundColor = APP_COLORS.ACCENTCOLOR } = props;
  return (
    <div className={styles.wrapper}>
      <div className={styles.dot1} style={{ backgroundColor }}></div>
      <div className={styles.dot2} style={{ backgroundColor }}></div>
      <div className={styles.dot3} style={{ backgroundColor }}></div>
      <div className={styles.dot4} style={{ backgroundColor }}></div>
    </div>
  );
}
