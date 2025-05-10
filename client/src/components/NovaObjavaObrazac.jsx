import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ObrazacTekst from "./ObrazacTekst";
import ObrazacUlov from "./ObrazacUlov";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

function NovaObjavaObrazac() {
  const [odabranaPrivatnost, setOdabranaPrivatnost] = useState("");
  const [odabranTipObjave, setOdabranTipObjave] = useState("prazno");
  const { endpointUrl } = useContext(EndpointUrlContext);
  const [ribaId, setRibaId] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const navigate = useNavigate();
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

  const handleSubmitText = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    try {
      const response = await fetch(`${endpointUrl}/api/objava/tekst`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        alert("Objava poslana na odobravanje");
        navigate("/");
      } else {
        console.error("Server error:", result.poruka);
        alert("Greška:" + result.poruka);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  function getFileExtension(mimeType) {
    const map = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };
    return map[mimeType] || ".jpg";
  }

  const handleSubmitUlov = async (e, type) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    if (ribaId) {
      formData.append("riba", ribaId);
    }
    if (compressedImage) {
      const extension = getFileExtension(compressedImage.type);
      const fileWithExtension = new File(
        [compressedImage],
        `image_${Date.now()}${extension}`,
        { type: compressedImage.type }
      );

      formData.append("slika", fileWithExtension);
    }

    try {
      const response = await fetch(`${endpointUrl}/api/objava/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        alert("Objava poslana na odobravanje");
        navigate("/");
      } else {
        console.error("Server error:", result.poruka);
        alert("Greška:" + result.poruka);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center m-10 ">
      <h1 className="text-white glavno-naslov text-[2rem]">Nova Objava</h1>
      <div>
        <form
          onSubmit={
            odabranTipObjave == "tekst" && odabranaPrivatnost == "javno"
              ? handleSubmitText
              : odabranTipObjave == "ulov" && odabranaPrivatnost == "javno"
              ? (e) => handleSubmitUlov(e, "javno")
              : odabranaPrivatnost == "privatno"
              ? (e) => handleSubmitUlov(e, "privatno")
              : ""
          }
        >
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
                className=" lg:hover:p-[0.5rem_1.3rem]  form-btn-hover hover:cursor-pointer duration-100 text-white font-glavno bg-moja_plava p-[0.5rem_1rem] rounded-[11px] outline outline-2 outline-white w-max"
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
                  className="lg:hover:p-[0.5rem_1.3rem] form-btn-hover hover:cursor-pointer duration-100 text-white font-glavno bg-moja_plava p-[0.5rem_1rem] rounded-[11px] outline outline-2 outline-white w-max"
                  id="tip"
                  name="tip"
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
            <ObrazacUlov
              privatnost={"javno"}
              setRibaId={setRibaId}
              setCompressedImage={setCompressedImage}
            />
          ) : odabranTipObjave == "prazno" && odabranaPrivatnost == "javno" ? (
            <p className="m-16 text-center text-white glavno-nav">
              Odaberite tip javne objave
            </p>
          ) : (
            ""
          )}
          {odabranaPrivatnost == "privatno" ? (
            <ObrazacUlov
              privatnost={"privatno"}
              setRibaId={setRibaId}
              setCompressedImage={setCompressedImage}
            />
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}

export default NovaObjavaObrazac;
