import React from "react";
import NavButton from "./NavButton";
import { useLogin } from "../kontekst/loginContext";
import NavDropdown from "./NavDropdown";

const Navigacija = () => {
  const { user } = useLogin();
  return (
    <nav className="w-full h-[15vh] bg-moja_plava flex items-center  border-b-[7px] border-white select-none">
      <div className="flex items-center  w-max ml-[5vw] pointer-events-none">
        <img
          className="h-[60px] select-none pointer-events-none"
          src="../logo/logo.svg"
          alt=""
          draggable="false"
        />
        <h1 className="text-white glavno-naslov ml-[5vw] select-none">
          Ribe Jadrana
        </h1>
      </div>
      <div className="mx-auto">
        <NavButton naziv="Ribe" url="/" pad="0.6rem_2.3rem" />
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
