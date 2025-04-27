import React from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
const polja = {
  1: { type: "email", naziv: "Email:", placeholder: "example@gmail.com" },
  2: { type: "password", naziv: "Lozinka:" },
};

const naslov = ["Prijava", "Prijavi se", "Registriraj se", "/registracija"];
function prijava() {
  function prijavaUSustav(formData) {
    // Provjera lozinka
    /*   if (Object.keys(newErrors).length === 0) {
          console.log("Podaci za registraciju:", formData);
          fetch("/api/registracija", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Uspješno:", data);
         
        })
        .catch((error) => {
          console.error("Greška:", error);
          // Možeš pokazati error korisniku
        }); */
  }
  return (
    <div class="min-h-screen flex flex-col">
      <Navigacija />
      <Obrazac
        naslov={naslov}
        polja={polja}
        onSubmit={prijavaUSustav}
        errors={""}
      />
      <Footer />
    </div>
  );
}

export default prijava;
