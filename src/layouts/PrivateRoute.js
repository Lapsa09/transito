import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/userSlice";

function PrivateRoute({ children }) {
  const user = useSelector(selectUser);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default PrivateRoute;
