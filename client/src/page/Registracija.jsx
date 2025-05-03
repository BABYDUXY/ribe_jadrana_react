import React, { useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
import { useNavigate } from "react-router-dom";

const polja = {
  1: {
    type: "text",
    naziv: "Korisničko Ime",
    placeholder: "Upiši korisničko ime",
  },
  2: { type: "email", naziv: "Email:", placeholder: "example@gmail.com" },
  3: { type: "password", naziv: "Lozinka:" },
  4: { type: "password", naziv: "Ponovljena lozinka:" },
};

const naslov = ["Registracija", "Registriraj se", "Prijavi se", "/prijava"];

function Registracija({ endpointUrl }) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function registracijaUSustav(formData) {
    let newErrors = {};

    // Provjera lozinki
    if (formData["3"] !== formData["4"]) {
      console.log(formData);
      newErrors["3"] = "Lozinke se ne podudaraju!";
      newErrors["4"] = "Lozinke se ne podudaraju!";
    }

    if (Object.keys(newErrors).length === 0) {
      fetch(`${endpointUrl}/api/registracija`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.poruka);
            });
          }
          return response.json();
        })
        .then((data) => {
          alert("Uspješna registracija!");
          navigate("/prijava");
        })
        .catch((error) => {
          console.error("Greška:", error);
          alert(error);
        });
    }

    setErrors(newErrors);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <Obrazac
        naslov={naslov}
        polja={polja}
        onSubmit={registracijaUSustav}
        errors={errors}
      />
      <Footer />
    </div>
  );
}

export default Registracija;
