import axios from "axios";
import { useEffect, useState } from "react";
import "../style/myHeader.css"

import { useNavigate } from "react-router-dom";

function MyHeader() {
   const navigate= useNavigate()

  const [user, setUser] = useState({});

  const token = localStorage.getItem("auth_token");


  const getUser = async () => {

    try {

      // token illa na function stop
      if (!token) return;

      const response = await axios.get(
        ` ${process.env.BACKEND_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.User);
      }

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    getUser();

  }, []);

  
  const handleLogout = ()=>{
    localStorage.removeItem("auth_token")
    navigate("/")
   
  }


  // token illa na header show aagathu
  if (!token) return null;

  return (

    <div className="header-container">

      {/* PROFILE ICON */}
      <div className="profile-wrapper">

        <div className="profile-icon">
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        {/* HOVER CARD */}
        <div className="profile-card">

          <h3>Name:{user?.name}</h3>

          <p>Email:{user?.email}</p>
      
         <br/>

          {token&&(
            <button onClick={handleLogout}>Logout</button>
          )}

        </div>

      </div>

    </div>
  );
}

export default MyHeader;