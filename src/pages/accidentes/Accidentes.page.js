import React, { useState } from "react";
import AccidentesLugarForm from "../../components/accidentes-components/AccidentesLugarForm";

function AccidentesPage() {
  const [step, setStep] = useState(1);
  return (
    <div>
      <h1>FORM</h1>
      {step == 1 && <AccidentesLugarForm />}
    </div>
  );
}

export default AccidentesPage;
