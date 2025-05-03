import React, { useState } from "react";
import { Link } from "react-router-dom";

function Obrazac({ naslov, polja, onSubmit, errors }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};

    Object.keys(polja).forEach((key, index) => {
      const input = e.target.querySelector(`#polje${key}`);
      if (input) {
        formData[key] = input.value;
      }
    });

    const medeni = e.target.querySelector('[name="ime"]').value; // This is the last input
    formData["ime"] = medeni;

    onSubmit(formData);
  };

  const brojPolja = Object.keys(polja).length;
  const [showPassword, setShowPassword] = useState({});

  return (
    <div className=" w-[20rem] min-h-[27rem] 3xl:h-[32rem] m-10 self-center flex flex-col items-center font-glavno text-white mb-16">
      <h1 className="mb-10 glavno-naslov text-[2rem]">{naslov[0]}</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-5 h-max glavno-nav"
      >
        {Object.entries(polja).map(([key, polje]) => (
          <div key={key} className="flex flex-col gap-1 ">
            <label className="glavno-nav" htmlFor={key}>
              {polje.naziv}
            </label>
            <div className="relative flex items-center w-full">
              <input
                id={`polje${key}`}
                name={key}
                type={showPassword[key] ? "text" : polje.type}
                placeholder={polje.placeholder ? polje.placeholder : ""}
                className={`h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold`}
              />
              {polje.type === "password" && (
                <div>
                  <img
                    src="/logo/oko.svg"
                    type="button"
                    className={`absolute transition-all duration-300 ease-in-out -right-12 w-[25px] ${
                      showPassword[key]
                        ? "opacity-100 -mt-2 hover:cursor-pointer hover:scale-105 z-10"
                        : "opacity-0 z-0"
                    }`}
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  ></img>
                  <img
                    src="/logo/trepavica.svg"
                    type="button"
                    className={`absolute transition-all duration-300 ease-in-out -right-12 w-[25px] ${
                      showPassword[key]
                        ? "opacity-0 z-0 -mt-2"
                        : "opacity-100 hover:cursor-pointer z-10 hover:scale-105 mt-0"
                    }`}
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                  ></img>
                </div>
              )}
            </div>
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
          className="w-[50%] form-btn-hover hover:w-[55%] bg-moja_plava-tamna p-[0.3rem_0rem] mt-2 self-center rounded-[7px] outline outline-white outline-[3px]"
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
