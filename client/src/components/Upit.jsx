import React from "react";

function Upit({ upit }) {
  return (
    <div className="w-full bg-white text-moja_plava p-[0.5rem_1rem] flex flex-col text-[1.1rem] rounded-[13px]">
      <div>
        <strong>Upit: </strong>
        {upit.upit}
      </div>
      <div>
        <strong>Odgovor: </strong>
        {upit?.odgovor || "Nema odgovora"}
      </div>
    </div>
  );
}

export default Upit;
