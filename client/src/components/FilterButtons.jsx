import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RandContext } from "../App";
import FilterBtn from "./FilterBtn";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function FilterButtons({ endpointUrl, setUrl }) {
  const [filter, setFilter] = useState("");
  const broj = useContext(RandContext);
  const rand = getRandomInt(1, broj);
  const vrstaFilters = {
    1: { url: "plave", fullname: "Plave", name: "Plave" },
    2: { url: "bijele", fullname: "Bijele", name: "Bijele" },
    3: { url: "otrovne", fullname: "Otrovne", name: "Otrovne" },
  };

  const tezinaFilters = {
    1: { url: "tezinaASC", fullname: "Težina A-Z", name: "A-Z" },
    2: { url: "tezinaDESC", fullname: "Težina Z-A", name: "Z-A" },
  };

  return (
    <div className="grid grid-cols-[11%_39%_39%_11%] place-items-center mt-10 mb-10">
      <img
        className="w-[40px] col-start-4 row-start-1"
        src="./public/logo/filter.svg"
        alt=""
      />
      <img
        className="h-[15px] col-start-1 row-start-1"
        src="./public/logo/three_dots.svg"
        alt=""
      />
      <ul class="col-start-3 row-start-1 flex flex-row justify-evenly justify-self-end [&>li]:inline-block px-7 border-white border-[3px] rounded-full  h-min">
        <FilterBtn
          name="Vrsta"
          dropdown={vrstaFilters}
          setUrl={setUrl}
          endpointUrl={endpointUrl}
          setFilter={setFilter}
        />
        <FilterBtn
          name="Težina"
          dropdown={tezinaFilters}
          setUrl={setUrl}
          endpointUrl={endpointUrl}
          setFilter={setFilter}
        />

        {/* <li class="group">
          <Link
            class="transition-all duration-200 ease-in-out rounded-md group-hover:p-[0.5rem_1.5rem] p-[0.5rem_1rem] border border-black"
            to={`/fish/${rand}`}
          >
            Random
          </Link>
        </li> */}
      </ul>
      <div className="col-start-2 row-start-2 mt-10 -mb-4 text-white place-self-start font-glavno text-[1.1rem] font-medium">
        {filter == "" ? setUrl(endpointUrl) : ""}
        {filter == "" ? (
          ""
        ) : (
          <div
            onClick={() => {
              setFilter("");
            }}
            className="group hover:cursor-pointer flex flex-row  border-white border-[3px] rounded-full justify-center items-center p-[0.5rem_1rem] hover:p-[0.5rem_1.5rem] transition-all duration-300 ease-in-out bg-red"
          >
            <h6 className="relative flex items-center justify-center mr-4 mb-[-5px]">
              {filter}{" "}
            </h6>
            <img className="h-[15px] " src="/logo/x.svg" alt="" srcset="" />
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterButtons;
