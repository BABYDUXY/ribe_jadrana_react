import React, { useContext, useState } from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import { useLogin } from "../kontekst/loginContext";
import { Link, Navigate } from "react-router-dom";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

function formatDate(dateString) {
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();

  // Return the formatted date as "DD.MM.YYYY"
  return `${day}.${month}.${year}`;
}

function MojProfil() {
  const userData = sessionStorage.getItem("korisnik");
  const user = userData ? JSON.parse(userData) : null;
  const { isLoading, logout } = useLogin();
  const [updateUsername, setUpdateUsername] = useState(false);
  const [editableUsername, setEditableUsername] = useState(
    user?.korisnicko_ime || ""
  );
  const { endpointUrl } = useContext(EndpointUrlContext);

  const updateUsernameFunction = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${endpointUrl}/api/korisnik/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          korisnicko_ime: editableUsername,
        }),
      });
      const rezultat = await response.json();
      if (!response.ok) {
        throw new Error(rezultat.poruka || "Greška prilikom zahtjeva.");
      }

      alert(rezultat?.poruka);

      // Update session storage
      const trenutniKorisnik = sessionStorage.getItem("korisnik");
      if (trenutniKorisnik) {
        const parsedKorisnik = JSON.parse(trenutniKorisnik);
        parsedKorisnik.korisnicko_ime = editableUsername;
        sessionStorage.setItem("korisnik", JSON.stringify(parsedKorisnik));
      }

      // Update the editable username in the state
      setEditableUsername(editableUsername);
      setUpdateUsername(false);

      // Trigger page reload to reflect changes
      window.location.reload();
    } catch (err) {
      console.log("Error:", err);
      alert(err);
    }
  };

  if (isLoading) return <div>Loading...</div>; // Optionally show loading state while checking the user

  if (!user) {
    return <Navigate to="/prijava" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigacija />
      <div className="w-[20rem] min-h-[27rem] 3xl:h-[32rem] m-10 self-center flex flex-col items-center font-glavno text-white mb-16 gap-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="leading-8 w-[140%] text-center glavno-naslov">
            {" "}
            Pozdrav, {user?.korisnicko_ime}
          </h1>
          <h3>Ovo su tvoji podaci.</h3>
        </div>
        <form action="" className="flex flex-col w-full gap-5 h-max glavno-nav">
          <div className="relative flex flex-col gap-1">
            <label className="glavno-nav" htmlFor="username">
              Korisničko Ime:
            </label>
            <div className="flex items-center">
              <input
                id="username"
                name="username"
                type="text"
                className={`h-10 rounded-[7px] p-3 ${
                  updateUsername ? "text-moja_plava" : "text-gray-400"
                } font-semibold w-full`}
                value={editableUsername}
                readOnly={!updateUsername}
                onChange={(e) => setEditableUsername(e.target.value)}
              />
              {updateUsername ? (
                <div className="absolute flex gap-3 -right-20 ">
                  <img
                    className="h-[23px] hover:cursor-pointer hover:scale-105 transition-all ease-out duration-200"
                    src="/logo/kvacica.svg"
                    alt=""
                    srcSet=""
                    onClick={updateUsernameFunction}
                  />
                  <img
                    className="h-[23px] hover:cursor-pointer hover:scale-105 transition-all ease-out duration-200"
                    src="/logo/x.svg"
                    alt=""
                    srcSet=""
                    onClick={() => {
                      setEditableUsername(user?.korisnicko_ime);
                      setUpdateUsername(false);
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUpdateUsername(true);
                  }}
                  className="absolute text-base -right-20"
                >
                  Promijeni
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="glavno-nav" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`h-10 rounded-[7px] p-3 text-gray-400 font-semibold`}
              value={user?.email}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="glavno-nav" htmlFor="date">
              Datum kreiranja:
            </label>
            <input
              id="date"
              name="date"
              type="text"
              className={`h-10 rounded-[7px] p-3 text-gray-400 font-semibold`}
              readOnly
              value={formatDate(user?.datum_kreiranja)}
            />
          </div>
          <button
            className="w-[50%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
            type="submit"
            onClick={logout}
          >
            Odjava
          </button>
        </form>
        <div className="flex gap-4 -mt-3 underline">
          <Link>Moji ulovi</Link>
          <Link>Moja sviđanja</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MojProfil;
