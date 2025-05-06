import React from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import NovaObjavaObrazac from "../components/NovaObjavaObrazac";

function NovaObjava() {
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
