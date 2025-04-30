import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../kontekst/loginContext";
function Footer() {
  const { user } = useLogin();
  return (
    <div className="w-full h-[10rem] bg-black mt-auto grid grid-cols-[20%_1fr_20%] place-items-center">
      <div className="h-max  w-[80%] col-start-2">
        <ul className="flex text-gray-300 justify-evenly glavno-nav">
          <li className="transition-all duration-200 hover:text-white">
            <Link to="/">Kontakt </Link>
          </li>

          <li className="transition-all duration-200 hover:text-white">
            <Link to="/">Uvijeti korištenja</Link>
          </li>
          {user ? (
            <li className="transition-all duration-200 hover:text-white">
              <Link to="/mojprofil">Moj profil </Link>
            </li>
          ) : (
            <li className="transition-all duration-200 hover:text-white">
              <Link to="/">Prijava </Link>
            </li>
          )}
        </ul>
        <h6 className="flex justify-center mt-8 text-white glavno-nav">
          2025. &copy; David Gušćić | Sva prava pridržana
        </h6>
      </div>
      <div className="flex justify-start w-full col-start-3 gap-3 h-max">
        <img
          className="w-[50px] hover:scale-105 hover:cursor-pointer transition-all duration-200"
          src="/logo/facebook.png"
          alt=""
          srcset=""
        />
        <img
          className="w-[50px] hover:scale-105 hover:cursor-pointer transition-all duration-200"
          src="/logo/instagram.png"
          alt=""
          srcset=""
        />
      </div>
    </div>
  );
}

export default Footer;
