import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import TravelHeader from "../components/TravelHeader";
import pic from '../assets/ballon.jpg'

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(true);
  useEffect(() => {
    if (!registerModalOpen) {
      navigate("/");
    }
  }, [registerModalOpen, navigate]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <React.Fragment>
      <TravelHeader />
        <div style={{backgroundImage:`url(${pic})`,backgroundSize:"cover",height:"100vh",width:"100vw",position:"absolute",top:0,left:0,}}></div>
      <RegisterForm setRegisterModalOpen={setRegisterModalOpen}/>
    </React.Fragment>
  )
}

export default RegisterPage;