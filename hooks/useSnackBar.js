import { useState } from "react";

export default function useSnackBar() {
  const [openSB, setOpenSB] = useState(false);
  const [response, setResponse] = useState({ severity: "", message: "" });

  const setError = (message) => {
    setResponse({ severity: "error", message });
    setOpenSB(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSB(false);
  };

  const setSuccess = (message) => {
    setResponse({ severity: "success", message });
    setOpenSB(true);
  };

  return { openSB, response, setError, setSuccess, closeSnackbar };
}
