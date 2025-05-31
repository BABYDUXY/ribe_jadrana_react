import React from "react";
import { useNavigate } from "react-router-dom";

function KarticaSaIkonom({ objekt }) {
  const navigate = useNavigate();
  return (
    <div className="bg-moja_plava w-[37rem] min-h-[20rem] rounded-[13px] flex flex-col justify-between  text-white font-glavno gap-8 overflow-hidden">
      <div className="flex items-center gap-8 ml-4 p-[1rem_1.8rem_0_1.8rem]">
        <img className="w-10" srcSet={`/logo/${objekt.ikona}`} />
        <h4 className="text-[1.7rem] font-bold">{objekt.naslov}</h4>
      </div>
      <p className="p-[0_1.8rem] text-lg">{objekt.opis}</p>
      <div
        onClick={() => navigate(objekt.link)}
        className="flex items-center justify-center h-16 gap-6 cursor-pointer bg-moja_plava-tamna group"
      >
        <h6 className="text-[1.3rem] font-semibold">{objekt.cta}</h6>
        <img
          className="-rotate-90 group-hover:translate-x-3 form-btn-hover w-7"
          srcSet="/logo/arrow.svg"
          alt=""
        />
      </div>
    </div>
  );
}

export default KarticaSaIkonom;
