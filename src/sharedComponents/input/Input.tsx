import React from "react";
import styles from "./Input.module.scss";
type InputProps = {
  has_error?: string;
  required?: boolean;
  name?: string;
  label_name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (event: any) => void;
  id: string;
};

const Input: React.FC<InputProps> = (props) => {
  const { has_error = "", required = false } = props;
  return (
    <div className="py-2">
      <label
        htmlFor={props.name}
        className={`${styles.form_label} ${required ? styles.required : ""}`}
      >
        {props.label_name}
      </label>
      <div className={styles.formControl}>
        <input type={"text"} {...props} />
      </div>
    </div>
  );
};
export default Input;
