import React from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import NovaObjavaObrazac from "../components/NovaObjavaObrazac";
import { Navigate } from "react-router-dom";

function NovaObjava() {
  const user = sessionStorage.getItem("korisnik");

  if (!user) {
    return <Navigate to="/prijava" />;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div>
        <NovaObjavaObrazac />
      </div>
      <Footer />
    </div>
  );
}

export default NovaObjava;
