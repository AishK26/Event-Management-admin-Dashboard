import React from "react";
import "./ButtonBox.css";

const ButtonBox = ({
  label,
  onClick,
  style,
  className,
  type,
  disabled,
  isActive,
}) => {
  return (
    <button
      onClick={onClick}
      style={style}
      type={type || "button"}
      disabled={disabled}
      className={`button shadow-xl 
         ${className}`}
    >
      {label}
    </button>
  );
};

export default ButtonBox;
