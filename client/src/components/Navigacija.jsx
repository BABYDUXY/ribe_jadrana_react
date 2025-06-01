import React from "react";
import NavButton from "./NavButton";
import { useLogin } from "../kontekst/loginContext";
import NavDropdown from "./NavDropdown";
import { useNavigate } from "react-router-dom";

const Navigacija = () => {
  const navigate = useNavigate();
  const { user } = useLogin();
  return (
    <nav className="w-full h-[15vh] bg-moja_plava flex items-center  border-b-[7px] border-white select-none">
      <div
        onClick={() => navigate("/")}
        className="flex items-center  w-max ml-[5vw] cursor-pointer group "
      >
        <div className="flex items-center justify-center cursor-pointer w-max">
          <img
            className="h-[60px] select-none pointer-events-none opacity-100  transition-all duration-[500ms] ease-in-out"
            src="/logo/logo.svg"
            alt=""
            draggable="false"
          />
          <img
            className="h-[60px] select-none pointer-events-none opacity-0 absolute group-hover:scale-105 group-hover:opacity-100 transition-all duration-[300ms] ease-in"
            src="/logo/logo_hover.svg"
            alt=""
            draggable="false"
          />
        </div>
        <h1 className="text-white glavno-naslov ml-[5vw] select-none">
          Ribe Jadrana
        </h1>
      </div>
      <div className="mx-auto">
        <NavButton naziv="Ribe" url="/ribe" pad="0.6rem_2.3rem" />
        <NavButton naziv="Ulovi" url="/ulovi" pad="0.6rem_2.3rem" />
        <NavButton naziv="Novosti" url="/novosti" pad="0.6rem_1.6rem" />
      </div>

      {user ? (
        <div className="ml-auto mr-[5vw] h-full flex justify-center flex-col items-center">
          <NavDropdown role="" />
        </div>
      ) : (
        <div className="ml-auto mr-[5vw]">
          <NavButton naziv="Prijava" url="/prijava" pad="0.6rem_1.7rem" />
        </div>
      )}
    </nav>
  );
};

export default Navigacija;
