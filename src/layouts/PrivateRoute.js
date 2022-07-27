import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/userSlice";

function PrivateRoute({ children, permission }) {
  const user = useSelector(selectUser);
  if (!user) return <Navigate to="/login" replace />;
  if (
    user.rol !== permission &&
    permission !== "public" &&
    user.rol !== "ADMIN"
  )
    return <Navigate to="/" replace />;
  return children;
}

export default PrivateRoute;
