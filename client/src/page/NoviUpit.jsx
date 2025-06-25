import React, { useContext, useEffect, useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../kontekst/loginContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

const polja = {
  1: { type: "textarea", naziv: "Upit:", placeholder: "Upiši tekst ..." },
};
const naslov = ["Novi Upit", "Pošalji", "Moji Upiti", "/mojiupiti"];
function NoviUpit() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isLoading, login, logout } = useLogin();
  const user = sessionStorage.getItem("korisnik");
  const { endpointUrl } = useContext(EndpointUrlContext);

  function slanjeUpita(formData) {
    let newErrors = {};

    if (Object.keys(newErrors).length === 0) {
      console.log("Novi upit:", formData);
      fetch(`${endpointUrl}/api/noviupit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${sessionStorage.getItem("token")}`,
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
          alert("Upit uspješno poslan!");
          navigate("/mojiupiti");
        })
        .catch((error) => {
          console.error("Greška:", error);
          alert(error);
        });
    }

    setErrors(newErrors);
  }

  useEffect(() => {
    if (!user) {
      navigate("/prijava");
    }
  }, [user, navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />

      <Obrazac
        naslov={naslov}
        polja={polja}
        onSubmit={slanjeUpita}
        errors={""}
      />

      <Footer />
    </div>
  );
}

export default NoviUpit;
