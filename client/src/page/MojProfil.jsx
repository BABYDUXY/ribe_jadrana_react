import React from "react";
import Navigacija from "../components/Navigacija";
import Footer from "../components/Footer";
import { useLogin } from "../kontekst/loginContext";
import { Link } from "react-router-dom";

function MojProfil() {
  const { user } = useLogin();
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
          <div className="flex flex-col gap-1">
            <label className="glavno-nav" htmlFor="username">
              Korisničko Ime:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`h-10 rounded-[7px] p-3 text-moja_plava font-semibold`}
              value={user?.korisnicko_ime}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="glavno-nav" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`h-10 rounded-[7px] p-3 text-moja_plava font-semibold`}
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
              className={`h-10 rounded-[7px] p-3 text-moja_plava font-semibold`}
              readOnly
            />
          </div>
          <button
            className="w-[50%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
            type="submit"
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
