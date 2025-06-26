import React, { useContext, useEffect, useState } from "react";
import Upit from "./Upit";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import ErrorText from "./ErrorText";

function AdminUpiti({ type, data, triggerRefresh = null }) {
  const [podaci, setPodaci] = useState([]);
  const { endpointUrl } = useContext(EndpointUrlContext);

  const handleSubmit = async (e, id, text) => {
    e.preventDefault();

    try {
      const response = await fetch(`${endpointUrl}/admin/odgovor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Token ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Greška prilikom slanja odgovora");
      }
      triggerRefresh(1);
      const result = await response.json();
      alert(result?.poruka);
    } catch (error) {
      console.error("Došlo je do greške:", error);
    }
  };

  useEffect(() => {
    if (type === "novi") {
      const filtrirani = data.filter((p) => p.odgovor === null);
      setPodaci(filtrirani);
    } else {
      const sortirano = [...data].sort((a, b) => b.ID - a.ID);
      setPodaci(sortirano);
    }
  }, [data, type]);

  return (
    <div className=" w-[35rem]  min-h-[27rem] 3xl:min-h-[32rem] my-10 m-[0_auto] flex flex-col items-center font-glavno text-white mb-16">
      <div className="flex flex-col items-center justify-center w-full gap-4">
        {podaci.length > 0 ? (
          podaci.map((upit, index) => (
            <Upit
              key={index}
              upit={upit}
              role="admin"
              type={type}
              handleSubmit={handleSubmit}
            />
          ))
        ) : (
          <ErrorText tekst="Nema upita!" />
        )}
      </div>
    </div>
  );
}

export default AdminUpiti;
