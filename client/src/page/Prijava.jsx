import React, { useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../kontekst/loginContext";
import { jwtDecode } from "jwt-decode";

const polja = {
  1: { type: "email", naziv: "Email:", placeholder: "example@gmail.com" },
  2: { type: "password", naziv: "Lozinka:" },
};

const naslov = ["Prijava", "Prijavi se", "Registriraj se", "/registracija"];
function Prijava({ endpointUrl }) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user, isLoading, login, logout } = useLogin();

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

          const token = data.token;
          sessionStorage.setItem("token", token);

          const decodedUser = jwtDecode(token);

          login(decodedUser);
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
      {user ? (
        <div className="min-h-[35rem]  w-[30rem] col-span-4 place-self-center glavno-nav text-white flex flex-col items-center justify-center">
          <div className="relative inline-block">
            <p className="text-4xl">Već ste prijavljeni!</p>
            <span className="absolute left-0 bottom-0 w-full h-[3px] rounded-full overflow-hidden">
              <span className="block w-1/3 h-full bg-white rounded-full animate-underlinePingPong" />
            </span>
          </div>
          <Link
            onClick={() => {
              logout();
            }}
            className="mt-10"
          >
            Odjava
          </Link>
        </div>
      ) : (
        <Obrazac
          naslov={naslov}
          polja={polja}
          onSubmit={prijavaUSustav}
          errors={""}
        />
      )}

      <Footer />
    </div>
  );
}

export default Prijava;
