import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);

  if (authToken) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
