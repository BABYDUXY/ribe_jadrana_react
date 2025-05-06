import React from "react";

function ObrazacTekst() {
  return (
    <div className="flex flex-col items-center w-full gap-6 my-10 font-glavno">
      <div className="flex flex-col gap-1 w-[50%]">
        <label className="text-white glavno-nav " htmlFor="naslov">
          Naslov:
        </label>
        <input
          className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold overflow-x-auto whitespace-nowrap text-ellipsis"
          name="naslov"
          type="text"
          placeholder="Upiši naslov..."
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-[50%] ">
        <label className="text-white glavno-nav " htmlFor="sadrzaj">
          Sadržaj:
        </label>
        <textarea
          className="h-40 w-full rounded-[7px] p-3 text-moja_plava font-semibold overflow-x-auto resize-none  text-ellipsis"
          name="sadrzaj"
          type="text"
          placeholder="Upiši ovdje..."
          required
        />
      </div>
      <div className="flex gap-4 w-[40%] ">
        <input required type="checkbox" className="w-4 " />
        <label className="text-white glavno-nav " htmlFor="prihvati-prava">
          Prihvaćam uvjete korištenja.
        </label>
      </div>
      <button
        className="w-[20%] text-white glavno-nav form-btn-hover hover:w-[23%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
        type="submit"
      >
        Objavi
      </button>
    </div>
  );
}

export default ObrazacTekst;
