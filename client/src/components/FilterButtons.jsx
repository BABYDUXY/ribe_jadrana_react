import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FilterBtn from "./FilterBtn";
const vrstaFilters = {
  1: { url: "plave", fullname: "Plave", name: "Plave" },
  2: { url: "bijele", fullname: "Bijele", name: "Bijele" },
  3: { url: "otrovne", fullname: "Otrovne", name: "Otrovne" },
};

const tezinaFilters = {
  1: {
    url: "",
    sort: { field: "max_tezina", direction: "asc" },
    fullname: "Težina A-Z",
    name: "A-Z",
  },
  2: {
    url: "",
    sort: { field: "max_tezina", direction: "desc" },
    fullname: "Težina Z-A",
    name: "Z-A",
  },
};

const duljinaFilters = {
  1: {
    url: "",
    sort: { field: "max_duljina", direction: "asc" },
    fullname: "Duljina A-Z",
    name: "A-Z",
  },
  2: {
    url: "",
    sort: { field: "max_duljina", direction: "desc" },
    fullname: "Duljina Z-A",
    name: "Z-A",
  },
};
const nazivFilters = {
  1: {
    url: "",
    sort: { field: "ime", direction: "asc" },
    fullname: "Naziv A-Z",
    name: "A-Z",
  },
  2: {
    url: "",
    sort: { field: "ime", direction: "desc" },
    fullname: "Naziv Z-A",
    name: "Z-A",
  },
};

function FilterButtons({
  endpointUrl,
  setUrl,
  setSortOptions,
  setSearchQuery,
  searchQuery,
}) {
  const [filter, setFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [searchInput, setSearchInput] = useState(false);
  const [toggleFilteri, setToggleFilteri] = useState(false);

  return (
    <div className="grid grid-cols-[11%_39%_39%_11%] place-items-center mt-10 mb-10 ">
      <img
        className="w-[40px] col-start-4 row-start-1 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
        src="./public/logo/filter.svg"
        alt=""
        onClick={() => {
          setToggleFilteri((prev) => !prev);
          setSearchInput(false);
        }}
      />
      <img
        className="h-[15px] col-start-1 row-start-1"
        src="./public/logo/three_dots.svg"
        alt=""
      />
      <ul
        class={`col-start-3 row-start-1 transition-all duration-500 ease-in flex flex-row justify-evenly justify-self-end [&>li]:inline-block px-7 border-white border-[3px] rounded-full  h-min ${
          toggleFilteri
            ? " w-[35rem] opacity-100 overflow-visible"
            : "w-0 opacity-0 overflow-hidden"
        }${searchInput ? " !w-[40rem]" : ""}`}
      >
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
          setUrl={setSortOptions}
          endpointUrl={endpointUrl}
          setFilter={setSortFilter}
        />
        <FilterBtn
          name="Duljina"
          dropdown={duljinaFilters}
          setUrl={setSortOptions}
          endpointUrl={endpointUrl}
          setFilter={setSortFilter}
        />
        <FilterBtn
          name="Naziv"
          dropdown={nazivFilters}
          setUrl={setSortOptions}
          endpointUrl={endpointUrl}
          setFilter={setSortFilter}
        />
        <input
          type="text"
          className={` relative transition-all duration-500 ease-in-out px-2 h-[full] bg-moja_plava border-b-2 border-gray-200 placeholder:text-[1rem]  focus:outline-none placeholder-gray-200 text-white glavno-nav focus:border-white  active:border-white place-self-center
          ${
            searchInput ? "w-[8rem] opacity-100" : "w-0 opacity-0"
          } overflow-hidden`}
          name=""
          id=""
          placeholder="Pretraži"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <img
          className="place-self-center ml-5 h-[23px] hover:cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
          src="/logo/povecalo.svg"
          alt=""
          onClick={() => setSearchInput((prev) => !prev)}
        />
      </ul>
      {/* prikaz filtera aktivnih*/}
      <div className="flex flex-row col-start-2 row-start-2 gap-2 mt-10 -mb-4 place-self-start">
        <div className=" text-white  font-glavno text-[1.1rem] font-medium">
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
        {/* setsort za sort opcije */}
        <div className=" text-white font-glavno text-[1.1rem] font-medium">
          {sortFilter == "" ? "" : ""}
          {sortFilter == "" ? (
            ""
          ) : (
            <div
              onClick={() => {
                setSortFilter("");
                setSortOptions("");
              }}
              className="group hover:cursor-pointer flex flex-row  border-white border-[3px] rounded-full justify-center items-center p-[0.5rem_1rem] hover:p-[0.5rem_1.5rem] transition-all duration-300 ease-in-out bg-red"
            >
              <h6 className="relative flex items-center justify-center mr-4 mb-[-5px]">
                {sortFilter}{" "}
              </h6>
              <img className="h-[15px] " src="/logo/x.svg" alt="" srcset="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterButtons;
