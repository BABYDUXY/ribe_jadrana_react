import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Navigacija from "./Navigacija";

function FishAllInfo({ value }) {
  return (
    <>
      <Navigacija />
      <div className=" w-screen  grid py-16  grid-cols-[auto_1fr_auto]">
        <Link to="/" className="hover:cursor-default w-min h-min">
          <img
            className="w-[60px] absolute ml-[6rem] hover:scale-x-[1.15] hover:scale-y-[1.05] transition-all duration-300  ease-in-out hover:cursor-pointer origin-right"
            src="/logo/arrow_back.svg"
            alt=""
          />
        </Link>
        <div className="w-[60rem] max-w-[90%]  h-[40rem] place-self-center rounded-[35px] bg-moja_plava outline outline-[5px] col-start-2 outline-white grid grid-cols-[1fr_1fr] grid-rows-2 ">
          <div className="flex flex-col  p-[2rem_0_0_2rem] ">
            <div className="overflow-hidden h-4/5 w-[90%] rounded-[15px] outline outline-[3px] outline-white">
              <img
                className="object-cover w-full h-full "
                src={`/${value.slika}`}
                alt={`Slika ribe ${value.ime}`}
              />
            </div>
            <div className="flex flex-col items-center justify-center mt-auto w-[90%] ">
              <h2 className="-mb-2 text-white glavno-naslov">
                Naziv: {value.ime}
              </h2>
              <h4 className="-mb-3 text-white glavno-small">{`(${value.lat_ime})`}</h4>
            </div>
          </div>
          <div className="row-span-2  p-[2rem_2rem_2rem_0]">
            <div
              dangerouslySetInnerHTML={{ __html: value.opis }}
              className="w-full h-full bg-moja_plava-tamna rounded-[17px] outline outline-white outline-[3px] p-[2rem] text-white font-glavno [&>*]:mb-5 overflow-auto leading-[20px] text-base"
            ></div>
          </div>
          <div className="flex justify-center  pb-[2rem] pt-[1.5rem]">
            <div className="w-[60%] h-full bg-moja_plava-tamna rounded-[9px] outline outline-white outline-[3px] p-[1.5rem]">
              <ul className="w-full h-full flex flex-col justify-between  [&>li>h8]:text-white [&>li>h8]:glavno-nav [&>li>h8]:font-semibold [&>li>p]:text-white [&>li>p]:leading-[20px] [&>li>p]:text-[1.05rem] [&>li>p]:-mt-1">
                <li className="pb-2">
                  <h8>Ostali nazivi:</h8>
                  <p>{value.ostali_nazivi}</p>
                </li>
                <li className="flex items-center gap-3">
                  <h8>Dubina: </h8>
                  <p>{`${value.min_dubina}  - ${value.max_dubina} m`}</p>
                </li>
                <li className="flex items-center gap-3">
                  <h8>Max duljina: </h8>
                  <p>{`${value.max_duljina} cm`}</p>
                </li>
                <li className="flex items-center gap-3">
                  <h8>Max težina: </h8>
                  <p>{`${value.max_tezina} kg`}</p>
                </li>
                <li className="flex items-center gap-3 ">
                  <h8>Otrovna: </h8>
                  <p
                    className={`${
                      value.otrovna ? "font-bold !text-[1.2rem]" : ""
                    }`}
                  >{`${value.otrovna ? "Da" : "Ne"}`}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FishAllInfo;
