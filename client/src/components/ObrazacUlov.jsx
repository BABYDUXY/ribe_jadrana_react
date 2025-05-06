import React, { useState } from "react";
import OdabirRibe from "./OdabirRibe";
function ObrazacUlov() {
  const [ribaId, setRibaId] = useState(null);
  const [slika, setSlika] = useState(null);

  const handleSlikaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlika(URL.createObjectURL(file)); // Pretvori u lokalni URL za preview
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 my-10 font-glavno">
      <div className="w-[50%] flex  items-center justify-between ">
        <div className="flex flex-col gap-1">
          <label className="text-white glavno-nav" htmlFor="riba">
            Ulovljena riba:
          </label>
          <OdabirRibe onSelect={(id) => setRibaId(id)} />
        </div>

        <div className="flex flex-col gap-1 w-[30%]">
          <label className="text-white glavno-nav" htmlFor="tezina">
            Težina (kg):
          </label>
          <input
            className="h-10 w-[100%] rounded-[7px] p-5 text-moja_plava font-semibold "
            type="number"
            name="tezina"
            step="0.2"
            min="0"
            placeholder="0.7 kg"
          />
        </div>
      </div>
      <div className="flex flex-col w-[50%] gap-1">
        <label className="text-white glavno-nav" htmlFor="tezina">
          Štap:
        </label>
        <input
          className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
          type="text"
          placeholder="npr. Rijeka..."
          name="mjesto"
        />
      </div>
      <div className="flex flex-col w-[50%] gap-1">
        <label className="text-white glavno-nav" htmlFor="tezina">
          Rola:
        </label>
        <input
          className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
          type="text"
          placeholder="npr. okuma primeZ 3000"
          name="mjesto"
        />
      </div>
      <div className="flex flex-col w-[50%] gap-1">
        <label className="text-white glavno-nav" htmlFor="tezina">
          Mamac / varalica:
        </label>
        <input
          className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
          type="text"
          placeholder="npr. crv"
          name="mjesto"
        />
      </div>
      <div className="flex flex-col w-[50%] gap-1">
        <label className="text-white glavno-nav" htmlFor="tezina">
          Opis:
        </label>
        <textarea
          className="h-20 w-full rounded-[7px] p-3 text-moja_plava font-semibold overflow-x-auto resize-none  text-ellipsis"
          name="sadrzaj"
          type="text"
          placeholder="Upiši ovdje..."
          required
        />
      </div>
      <div className="w-[50%] flex  items-center justify-between">
        <div className="flex flex-col w-[50%] gap-1">
          <label className="text-white glavno-nav" htmlFor="tezina">
            Mjesto Ulova:
          </label>
          <input
            className="h-10 w-[15rem] rounded-[7px] p-3 text-moja_plava font-semibold "
            type="text"
            placeholder="npr. Rijeka..."
            name="mjesto"
          />
        </div>
        <div className="flex flex-col w-[30%] gap-1">
          <label className="text-white glavno-nav" htmlFor="tezina">
            Slika:
          </label>
          <input
            id="uploadSlike"
            type="file"
            accept="image/*"
            onChange={handleSlikaChange}
            className="hidden text-sm"
          />
          <label
            htmlFor="uploadSlike"
            className="px-4 py-2 font-glavno w-[100%]  form-btn-hover text-white transition rounded cursor-pointer outline outline-[2px] outline-white bg-moja_plava-tamna hover:w-[105%]"
          >
            Odaberi
          </label>
        </div>
      </div>
      {slika && (
        <div className="w-[50%] flex items-center justify-center rounded-[11px] ">
          <img
            src={slika}
            alt="Odabrana slika"
            className="w-full h-auto rounded-[9px] border-2 border-white"
          />
        </div>
      )}
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

export default ObrazacUlov;
