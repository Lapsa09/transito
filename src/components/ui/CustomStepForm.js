import React from "react";
import { motion } from "framer-motion";

function CustomStepForm({ children, activeStep, step }) {
  const variant = {
    open: {
      x: `-${activeStep * 100}%`,
    },
    left: {
      x: "-120vw",
    },
    right: {
      x: "120vw",
    },
  };
  return (
    <motion.div
      style={{ width: "100%" }}
      variants={variant}
      animate={
        activeStep === step ? "open" : activeStep > step ? "left" : "right"
      }
    >
      {children}
    </motion.div>
  );
}

export default CustomStepForm;
