import React from "react";
import { Link } from "react-router-dom";

function Obrazac({ naslov, polja, onSubmit, errors }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};

    Object.keys(polja).forEach((key, index) => {
      formData[key] = e.target[index].value;
    });

    const medeni = e.target.querySelector('[name="ime"]').value; // This is the last input
    formData["ime"] = medeni;

    onSubmit(formData);
  };

  const brojPolja = Object.keys(polja).length;

  return (
    <div className=" w-[20rem] min-h-[27rem] 3xl:h-[32rem] m-10 self-center flex flex-col items-center font-glavno text-white mb-16">
      <h1 className="mb-10 glavno-naslov text-[2rem]">{naslov[0]}</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-5 h-max glavno-nav"
      >
        {Object.entries(polja).map(([key, polje]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="glavno-nav" htmlFor={key}>
              {polje.naziv}
            </label>
            <input
              id={key}
              name={key}
              type={polje.type}
              placeholder={polje.placeholder ? polje.placeholder : ""}
              className={`h-10 rounded-[7px] p-3 text-moja_plava font-semibold`}
            />
            {errors[key] && (
              <span className="mt-1 text-sm text-white ">{errors[key]}</span>
            )}
          </div>
        ))}
        <input
          key={brojPolja + 1}
          type="text"
          name="ime"
          className="left-[-9999] absolute opacity-0"
        ></input>
        <button
          className="w-[50%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
          type="submit"
        >
          {naslov[1]}
        </button>
      </form>
      <Link to={naslov[3]} className="mt-5 underline">
        {naslov[2]}
      </Link>
    </div>
  );
}

export default Obrazac;
