import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const PrivateRoute = ({children}) => {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};
