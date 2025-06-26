import React, { useContext, useRef, useState } from "react";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

function Upit({ upit, role = null, type = null, handleSubmit = null }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      if (value === "") {
        textarea.style.height = "1.75rem"; // reset to initial height
      } else {
        textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px"; // max 10rem
      }
    }
  };

  return (
    <div className="w-full bg-white text-moja_plava p-[0.5rem_1rem] flex flex-col text-[1.1rem] rounded-[13px]">
      {role === "admin" ? (
        <h5>
          {" "}
          <strong>Autor: </strong>
          {upit.korisnicko_ime}
        </h5>
      ) : (
        ""
      )}
      <div className="w-full h-auto ">
        <strong>Upit: </strong>
        {upit.upit}
      </div>
      <div>
        {type === "novi" ? (
          <form
            onSubmit={(e) => {
              handleSubmit(e, upit.ID, text);
              setText("");
            }}
            className="flex items-center"
          >
            <label htmlFor="odgovor">
              <strong>Odgovor: </strong>
            </label>
            <textarea
              id="odgovor"
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              placeholder="Napiši odgovor..."
              className="w-full px-2 border-0 border-b-2 resize-none h-7 border-moja_plava"
            ></textarea>
            {text ? <button type="submit">Pošalji</button> : ""}
          </form>
        ) : (
          <>
            <strong>Odgovor: </strong>
            {upit?.odgovor || "Nema odgovora"}
          </>
        )}
      </div>
    </div>
  );
}

export default Upit;
