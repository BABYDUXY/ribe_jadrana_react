import React, { useContext, useEffect, useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import Obrazac from "../components/Obrazac";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../kontekst/loginContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import Upit from "../components/Upit";
import ErrorText from "../components/ErrorText";

function MojiUpiti() {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("korisnik");
  const { endpointUrl } = useContext(EndpointUrlContext);
  const [upiti, setUpiti] = useState(null);

  function fetchUpiti() {
    fetch(`${endpointUrl}/api/mojiupiti`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.poruka || "Greška pri dohvaćanju upita.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setUpiti(data);
      })
      .catch((error) => {
        console.error("Greška:", error.message);
        alert(error.message);
      });
  }

  useEffect(() => {
    fetchUpiti();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/prijava");
    }
  }, [user, navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className=" w-[35rem]  min-h-[27rem] 3xl:min-h-[32rem] m-10 self-center flex flex-col items-center font-glavno text-white mb-16">
        <h1 className="mb-10 glavno-naslov text-[2rem]">Moji Upiti</h1>
        {upiti ? (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            {upiti.map((upit, index) => (
              <Upit key={index} upit={upit} />
            ))}
            <Link
              className="font-glavno text-[1.1rem] underline"
              to={"/noviupit"}
            >
              Pošalji upit
            </Link>
          </div>
        ) : (
          ""
        )}
        {!upiti || upiti === undefined ? (
          <div className="flex flex-col items-center justify-center h-[80%] gap-12">
            <ErrorText tekst="Nema poslanih upita !" />
            <Link
              className="font-semibold font-glavno text-[1.2rem] hover:underline"
              to={"/noviupit"}
            >
              Pošalji upit
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MojiUpiti;
