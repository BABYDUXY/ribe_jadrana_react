import React from "react";
import { useLogin } from "../kontekst/loginContext";
import { Link } from "react-router-dom";

function NavDropdown({ role }) {
  const { user, logout } = useLogin();
  return (
    <div className="relative z-20 flex items-center justify-center h-full group">
      <div className="flex items-center p-[0.4rem_1rem] gap-2 group-hover:cursor-default">
        <h5 className="text-white glavno-nav">{user?.korisnicko_ime}</h5>
        <img
          className="h-[7px] transition-transform duration-300 group-hover:rotate-180"
          src="/logo/arrow.svg"
          alt=""
          srcSet=""
        />
      </div>
      <ul
        className="absolute  w-[10rem]  flex flex-col justify-center top-[105%] items-center  outline outline-[4px] outline-white rounded-b-[15px] [&>*]:bg-moja_plava [&>*]:flex [&>*]:justify-center [&>li]:p-[0.2rem_0] [&>li>a]:p-[0.1rem_1rem] [&>*:hover]:cursor-pointer [&>*:hover]:bg-moja_plava-tamna [&>*]:w-full [&>*]:text-center text-white font-glavno [&>li>a]:border-b-2 
      [&>li>a]:px-2 [&>li:nth-last-child(1)]:border-0 [&>li:hover>a]:px-3 [&>li:nth-last-child(1)>a]:border-0 [&>li>a]:transition-all [&>li>a]:duration-300 [&>li>a]:ease-in-out h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in group-hover:h-[9rem] group-hover:opacity-100"
      >
        <li className="">
          <Link to="/">Moj profil</Link>
        </li>
        <li>
          <Link to="/">Moji ulovi</Link>
        </li>
        <li>
          <Link to="/">Moja Sviđanja</Link>
        </li>
        <li>
          <Link
            onClick={() => {
              logout();
            }}
          >
            Odjava
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NavDropdown;
