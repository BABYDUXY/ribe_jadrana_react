import React, { useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
import { useNavigate } from "react-router-dom";

const polja = {
  1: { type: "email", naziv: "Email:", placeholder: "example@gmail.com" },
  2: { type: "password", naziv: "Lozinka:" },
};

const naslov = ["Prijava", "Prijavi se", "Registriraj se", "/registracija"];
function Prijava({ endpointUrl }) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function prijavaUSustav(formData) {
    let newErrors = {};

    if (Object.keys(newErrors).length === 0) {
      console.log("Podaci za prijavu:", formData);
      fetch(`${endpointUrl}/api/prijava`, {
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
          console.log("Uspješno:", data);
          alert("Uspješna Prijava!");
          navigate("/");
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
        onSubmit={prijavaUSustav}
        errors={""}
      />
      <Footer />
    </div>
  );
}

export default Prijava;
