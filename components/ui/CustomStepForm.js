import React from "react";
import { motion } from "framer-motion";
import style from "../../styles/FormLayout.module.css";

function CustomStepForm({ children, activeStep, step }) {
  const variant = {
    open: {
      x: 0,
      transition: {
        display: "none",
      },
      transitionEnd: { display: "grid" },
    },
    closed: {
      x: "-120vw",
      transition: {
        display: "grid",
      },
      transitionEnd: { display: "none" },
    },
  };
  return (
    <motion.div
      className={`${style.form__box__inputs}`}
      variants={variant}
      animate={activeStep === step ? "open" : "closed"}
    >
      {children}
    </motion.div>
  );
}

export default CustomStepForm;
