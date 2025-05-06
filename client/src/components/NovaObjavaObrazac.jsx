import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ObrazacTekst from "./ObrazacTekst";
import ObrazacUlov from "./ObrazacUlov";

function NovaObjavaObrazac() {
  const [odabranaPrivatnost, setOdabranaPrivatnost] = useState("");
  const [odabranTipObjave, setOdabranTipObjave] = useState("prazno");
  const handleChangePrivatnost = (e) => {
    setOdabranaPrivatnost(e.target.value);
  };
  const handleChangeTipObjave = (e) => {
    setOdabranTipObjave(e.target.value);
  };

  useEffect(() => {
    if (odabranaPrivatnost != "javno") {
      setOdabranTipObjave("prazno");
    }
  }, [odabranaPrivatnost]);
  return (
    <div className="flex flex-col items-center justify-center m-10 ">
      <h1 className="text-white glavno-naslov text-[2rem]">Nova Objava</h1>
      <div>
        <form action="">
          <div className="flex flex-col items-center justify-center gap-2">
            <label className="text-white glavno-nav" for="privatnost"></label>
            {odabranaPrivatnost === "javno" ? (
              <p className="text-white font-glavno text-[0.9rem]">
                Javne objave moraju biti odobrene od strane administratora,
                vidljive su svima i prikazuju se na stranici{" "}
                <Link className="underline" to="/ulovi">
                  "Ulovi"
                </Link>
                .
              </p>
            ) : odabranaPrivatnost === "privatno" ? (
              <p className="text-white font-glavno text-[0.9rem]">
                Privatne objave su vidljive samo vama i spremaju se na stranicu{" "}
                <Link className="underline" to="#">
                  "Moji ulovi"
                </Link>
                .
              </p>
            ) : (
              <p className="text-white font-glavno text-[0.9rem]">
                Molimo odaberite vidljivost objave.
              </p>
            )}
            <div className="flex items-center justify-center gap-4">
              <select
                className=" hover:p-[0.5rem_1.3rem] form-btn-hover hover:cursor-pointer duration-100 text-white font-glavno bg-moja_plava p-[0.5rem_1rem] rounded-[11px] outline outline-2 outline-white w-max"
                id="privatnost"
                name="privatnost"
                onChange={handleChangePrivatnost}
              >
                <option value="prazno">-</option>
                <option value="javno">Javno</option>
                <option value="privatno">Privatno</option>
              </select>
              {odabranaPrivatnost == "javno" && (
                <select
                  className="hover:p-[0.5rem_1.3rem] form-btn-hover hover:cursor-pointer duration-100 text-white font-glavno bg-moja_plava p-[0.5rem_1rem] rounded-[11px] outline outline-2 outline-white w-max"
                  id="privatnost"
                  name="privatnost"
                  onChange={handleChangeTipObjave}
                >
                  <option value="prazno">-</option>
                  <option value="ulov">Ulov</option>
                  <option value="tekst">Tekst</option>
                </select>
              )}
            </div>
          </div>

          {odabranTipObjave == "tekst" && odabranaPrivatnost == "javno" ? (
            <ObrazacTekst />
          ) : odabranTipObjave == "ulov" && odabranaPrivatnost == "javno" ? (
            <ObrazacUlov />
          ) : odabranTipObjave == "prazno" && odabranaPrivatnost == "javno" ? (
            <p className="m-16 text-center text-white glavno-nav">
              Odaberite tip javne objave
            </p>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}

export default NovaObjavaObrazac;
