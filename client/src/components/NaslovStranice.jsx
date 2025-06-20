import React from "react";

function NaslovStranice({ tekst, opis = null }) {
  const duljina = tekst.length;
  return (
    <div
      draggable="false"
      className="flex flex-col items-center pointer-events-none select-none"
    >
      <div className="relative inline-block px-1 overflow-hidden">
        <h1
          className={`text-white glavno-naslov text-center text-[2rem] ${
            duljina >= 10 ? "mb-3" : duljina > 7 ? "mb-2" : "mb-1"
          }`}
        >
          {tekst}
        </h1>
        <span
          className={`absolute bottom-0  ${
            duljina >= 10
              ? "w-[130%] animated-very-long-element"
              : duljina > 7
              ? "w-[150%] animated-long-element"
              : duljina <= 5
              ? "w-[250%] animated-element"
              : "w-[180%] animated-element"
          }  overflow-hidden rounded-full h-max`}
        >
          <img srcSet="logo/val.svg" className="w-full h-auto " />
        </span>
      </div>
      <h4 className="mt-2 italic text-white font-glavno">{opis}</h4>
    </div>
  );
}

export default NaslovStranice;
