import { Navigate } from "react-router-dom";

const HelperRouter = ({ children }) => {
  console.log("child router working",children)

  const token = localStorage.getItem("auth_token");
  console.log("token====>",token);
   if (!token){
    return <Navigate to="/" />;   
  }

 
  return (
    <div>
      {children}
    </div>
  );
};

export default HelperRouter;