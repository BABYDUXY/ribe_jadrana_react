import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

function ListObjava({ value }) {
  const date = new Date(value.datum_kreiranja);
  const { endpointUrl } = useContext(EndpointUrlContext);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();

  const formattedDate = `${day}.${month}.${year}.`;
  return (
    <div className=" outline outline-[5px] outline-white min-h-[13rem] w-[50rem] grid grid-cols-[60%_40%] gap-7 text-white p-[1.5rem_3rem] font-glavno rounded-[22px] overflow-hidden">
      <div className="flex flex-col justify-between ">
        <h2 className=" glavno-nav"> Objavio/la: {value.autor}</h2>
        <div className="flex justify-between">
          <div className="bg-moja_plava-tamna w-[47%]  flex flex-col  justify-center rounded-[13px] outline outline-[2px] outlinr-white">
            <div className="py-2 ml-5">
              <Link
                to={`/fish/${value.id_ribe}`}
                className="glavno-nav text-[1.3rem] font-bold underline"
              >
                Riba: {value.ime_ribe}
              </Link>
              <p className="-mt-1 text-base font-medium">
                Težina: {value.tezina} kg
              </p>
            </div>
          </div>
          <div className="bg-moja_plava-tamna w-[47%]   flex flex-col  justify-center rounded-[13px] outline outline-[2px] outlinr-white">
            <div className="py-2 ml-5">
              <p className="text-lg font-medium">Lokacija: {value.mjesto}</p>
              <p className="-mt-1 text-sm ">{formattedDate}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ">
          <img className="w-[20px]" srcSet="/logo/like.svg" alt="" />
          <p className="mb-[-0.3rem] ">100</p>
        </div>
      </div>
      <div className="flex gap-7 ">
        <div className=" w-[11rem] rounded-[13px] overflow-hidden outline outline-[2px] outline-white">
          <img
            className="object-cover w-full h-full"
            srcSet={`${endpointUrl}${value.slika_direktorij}`}
            alt=""
          />
        </div>
        <img className="w-[60px]" srcSet="logo/expand.svg" alt="" />
      </div>
    </div>
  );
}

export default ListObjava;
