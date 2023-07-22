import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import TravelHeader from "../components/TravelHeader";
import pic from '../assets/beach.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(true);
  useEffect(() => {
    if (!loginModalOpen) {
      navigate("/");
    }
  }, [loginModalOpen, navigate]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <React.Fragment>
      <TravelHeader />
        <div style={{backgroundImage:`url(${pic})`,backgroundSize:"cover",height:"100vh",width:"100vw",position:"absolute",top:0,left:0,}}></div>
      <LoginForm setLoginModalOpen={setLoginModalOpen}/>
    </React.Fragment>
  )
}

export default LoginPage;