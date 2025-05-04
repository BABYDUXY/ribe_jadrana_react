import React from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";

function NovaObjava() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div>
        <h1 className="text-center text-white glavno-naslov">Nova objava</h1>
      </div>
      <Footer />
    </div>
  );
}

export default NovaObjava;
