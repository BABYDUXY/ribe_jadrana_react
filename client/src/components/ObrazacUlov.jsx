import React, { useState } from "react";
import OdabirRibe from "./OdabirRibe";
import ComboBox from "./ComboBox";
import imageCompression from "browser-image-compression";

function ObrazacUlov({
  privatnost,
  setRibaId,
  setCompressedImage,
  promptValues = {},
}) {
  const [slika, setSlika] = useState(null);

  const lista = [
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "slope",
    "sisters",
    "Watermelon",
  ];

  const handleSlikaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);

      setSlika(URL.createObjectURL(compressed));
      setCompressedImage(compressed);
    } catch (err) {
      console.error("Greška pri kompresiji slike:", err);
    }
  };

  const [stap_brend, stap_model] =
    Array.isArray(promptValues?.kombinirani_model) &&
    promptValues.kombinirani_model[0]
      ? promptValues.kombinirani_model[0].split(" ")
      : ["", ""];

  const [rola_brend, rola_model] =
    Array.isArray(promptValues?.kombinirani_model) &&
    promptValues.kombinirani_model[1]
      ? promptValues.kombinirani_model[1].split(" ")
      : ["", ""];

  return (
    <div className="flex flex-col items-center w-[45rem] gap-6 my-10 font-glavno">
      <div className="w-[50%] flex  items-center justify-between ">
        <div className="flex flex-col gap-1">
          <label className="text-white glavno-nav" htmlFor="riba">
            Ulovljena riba:
          </label>
          <OdabirRibe
            onSelect={setRibaId}
            defaultValue={promptValues.id_ribe || null}
          />
        </div>

        <div className="flex flex-col gap-1 w-[30%]">
          <label className="text-white glavno-nav" htmlFor="tezina">
            Težina (kg):
          </label>
          <input
            className="h-10 w-[100%] rounded-[7px] p-5 text-moja_plava font-semibold "
            type="number"
            name="tezina"
            id="tezina"
            step="0.1"
            min="0"
            defaultValue={promptValues?.tezina || ""}
            placeholder="0.7 kg"
            required
          />
        </div>
      </div>
      <div className="flex flex-col w-[50%] gap-1 ">
        <label
          className="text-white glavno-nav text-[1.4rem] border-b-2 border-white"
          htmlFor="stap_brend"
        >
          Štap
        </label>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-[40%]">
            <label className="text-white glavno-nav " htmlFor="stap_brend">
              Brend:
            </label>
            <ComboBox
              lista={lista}
              defaultValue={stap_brend || ""}
              name={"stap_brend"}
            />
          </div>
          <div className="flex flex-col gap-1 w-[60%]">
            <label className="text-white glavno-nav" htmlFor="stap_model">
              Model:
            </label>
            <ComboBox
              lista={lista}
              defaultValue={stap_model || ""}
              name={"stap_model"}
            />
          </div>
        </div>
        {promptValues?.link ? (
          <div className="flex flex-col gap-1 w-[100%]">
            <label className="text-white glavno-nav" htmlFor="link_stap">
              Link:
            </label>
            <input
              className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
              type="text"
              name="link_stap"
              id="link_stap"
              required
              defaultValue={
                promptValues?.link[0] ||
                "https://topfishing.hr/ribolovna-oprema-kategorija/79/stapovi"
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col w-[50%] gap-1 ">
        <label
          className="text-white glavno-nav text-[1.4rem] border-b-2 border-white"
          htmlFor="rola_brend"
        >
          Rola
        </label>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 w-[40%]">
            <label className="text-white glavno-nav " htmlFor="rola_brend">
              Brend:
            </label>
            <ComboBox
              lista={lista}
              defaultValue={rola_brend || ""}
              name={"rola_brend"}
            />
          </div>
          <div className="flex flex-col gap-1 w-[60%]">
            <label className="text-white glavno-nav" htmlFor="rola_model">
              Model:
            </label>
            <ComboBox
              lista={lista}
              defaultValue={rola_model || ""}
              name={"rola_model"}
            />
          </div>
        </div>
        {promptValues?.link ? (
          <div className="flex flex-col gap-1 w-[100%]">
            <label className="text-white glavno-nav" htmlFor="link_rola">
              Link:
            </label>
            <input
              className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
              type="text"
              name="link_rola"
              id="link_rola"
              required
              defaultValue={
                promptValues?.link[2] ||
                "https://topfishing.hr/ribolovna-oprema-kategorija/80/role"
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col w-[50%] gap-1 ">
        <label className="text-white glavno-nav" htmlFor="mamac">
          Mamac / varalica:
        </label>
        <input
          className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
          type="text"
          placeholder="npr. crv"
          name="mamac"
          id="mamac"
          required
          defaultValue={promptValues?.mamac || ""}
        />
        {promptValues?.link ? (
          <div className="flex flex-col gap-1 w-[100%]">
            <label className="text-white glavno-nav" htmlFor="link_mamac">
              Link:
            </label>
            <input
              className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
              type="text"
              name="link_mamac"
              id="link_mamac"
              required
              defaultValue={
                promptValues?.link[1] ||
                "https://topfishing.hr/ribolovna-oprema-kategorija/170/mamci-za-morski-ribolov"
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col w-[50%] gap-1">
        <label className="text-white glavno-nav" htmlFor="opis">
          Opis: - neobavezno
        </label>
        <textarea
          className="h-20 w-full rounded-[7px] p-3 text-moja_plava font-semibold overflow-x-auto resize-none  text-ellipsis"
          id="opis"
          name="opis"
          type="text"
          placeholder="Upiši ovdje..."
          defaultValue={promptValues?.opis || ""}
        />
      </div>
      <div className="w-[50%] flex  items-center justify-between">
        <div className="flex flex-col w-[50%] gap-1">
          <label className="text-white glavno-nav" htmlFor="mjesto">
            Mjesto Ulova:
          </label>
          <input
            className="h-10 w-[15rem] rounded-[7px] p-3 text-moja_plava font-semibold "
            type="text"
            placeholder="npr. Rijeka..."
            name="mjesto"
            id="mjesto"
            required
            defaultValue={promptValues?.mjesto || ""}
          />
        </div>
        {promptValues?.slika_direktorij ? (
          ""
        ) : (
          <div className="flex flex-col w-[30%] gap-1">
            <label className="text-white glavno-nav" htmlFor="uploadSlike">
              Slika:
            </label>
            <input
              id="uploadSlike"
              type="file"
              accept="image/*"
              onChange={handleSlikaChange}
              className="hidden text-sm"
              required
            />
            <label
              htmlFor="uploadSlike"
              className="px-4 py-2 font-glavno w-[100%]  form-btn-hover text-white transition rounded cursor-pointer outline outline-[2px] outline-white bg-moja_plava-tamna hover:w-[105%]"
            >
              Odaberi
            </label>
          </div>
        )}
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
      {privatnost === "privatno" && (
        <div className="flex flex-col w-[50%] gap-1">
          <label className="text-white glavno-nav" htmlFor="datum">
            Datum Ulova
          </label>
          <input
            className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
            type="date"
            placeholder=""
            name="datum"
            id="datum"
            required
          />
        </div>
      )}

      <div className="flex gap-4 w-[40%] ">
        <input required type="checkbox" id="prihvati-prava" className="w-4 " />
        <label className="text-white glavno-nav " htmlFor="prihvati-prava">
          Prihvaćam uvjete korištenja.
        </label>
      </div>
      {promptValues?.id_ribe ? (
        ""
      ) : (
        <button
          className="w-[20%] text-white glavno-nav form-btn-hover hover:w-[23%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
          type="submit"
        >
          Objavi
        </button>
      )}
    </div>
  );
}

export default ObrazacUlov;
