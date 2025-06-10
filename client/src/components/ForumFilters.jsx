import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ForumFilterBtn from "./ForumFilterBtn";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useLogin } from "../kontekst/loginContext";
import MoreOptionsDropdown from "./MoreOptionsDropdown";
import SliderTocke from "./SliderTocke";
const popularnoFilters = {
  1: {
    sort: { field: "likes", direction: "asc" },
    fullname: "Popularno A-Z",
    name: "A-Z",
  },
  2: {
    sort: { field: "likes", direction: "desc" },
    fullname: "Popularno Z-A",
    name: "Z-A",
  },
};

const opremaFilters = {
  1: {
    type: "hoverDropdown",
    url: "",
    fullname: "Štap",
    name: "Štap",
    children: {
      1: {
        name: "Brand",
        type: "dropdown",
        children: {
          1: {
            sort: { field: "likes", direction: "asc" },
            fullname: "Mitsubishi",
            name: "Mitsubishi",
          },
          2: {
            sort: { field: "likes", direction: "asc" },
            fullname: "Kawasaki",
            name: "Kawasaki",
          },
        },
      },

      2: {
        type: "search",
        fullname: "Štap: pretraži",
        name: "Pretraži",
      },
    },
  },
  2: {
    type: "hoverDropdown",
    url: "",
    fullname: "Rola",
    name: "Rola",
    children: {
      1: {
        name: "Brand",
        type: "dropdown",
        children: {
          1: {
            sort: { field: "likes", direction: "asc" },
            fullname: "Mitsubishi",
            name: "Mitsubishi",
          },
        },
      },

      2: {
        type: "search",
        fullname: "Rola: pretraži",
        name: "Pretraži",
      },
    },
  },
};

const moreOptionsDropdown = {
  1: { name: "Nova Objava", url: "/novaobjava" },
  2: { name: "Moje Objave", url: "/mojeobjave" },
  3: { name: "Pošalji Upit", url: "/noviupit" },
};

function ForumFilters({ setSortOptions, setSearchQuery, searchQuery }) {
  const { endpointUrl, setUrl, backendData } = useContext(EndpointUrlContext);
  const { user } = useLogin();
  const [filter, setFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [toggleFilteri, setToggleFilteri] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  const [moreOptionsToggle, setMoreOptionsToggle] = useState(false);
  const [toggleViewOptions, setToggleViewOptions] = useState(false);

  const valueSlider = { default: 6, step: 1, min: 3, max: 10 };

  return (
    <div className="grid grid-cols-[15%_35%_35%_15%] place-items-center mt-10 mb-10 ">
      <img
        className="w-[40px] col-start-4 row-start-1 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
        src="./public/logo/filter.svg"
        alt=""
        draggable="false"
        onClick={() => {
          setToggleFilteri((prev) => !prev);
          setSearchInput(false);
        }}
      />
      {user ? (
        <div className="w-[50px] col-start-1 row-start-1 self-start  form-btn-hover cursor-pointer relative">
          <img
            className={`w-full hover:scale-105 form-btn-hover cursor-pointer absolute  ${
              moreOptionsToggle ? "opacity-0 z-0" : "opacity-100 z-10"
            }`}
            draggable="false"
            src="./public/logo/plus.svg"
            alt=""
            onClick={() => {
              setMoreOptionsToggle(true);
            }}
          />
          <img
            className={`w-full hover:scale-105 form-btn-hover cursor-pointer absolute ${
              moreOptionsToggle ? "opacity-100 z-10 " : "opacity-0 z-0"
            }`}
            draggable="false"
            src="./public/logo/minus.svg"
            alt=""
            onClick={() => {
              setMoreOptionsToggle(false);
            }}
          />

          <div
            className={`form-btn-hover absolute left-[150%] text-nowrap outline outline-[3px]  outline-white rounded-[11px] overflow-clip ${
              moreOptionsToggle
                ? "opacity-100 w-40 ml-0"
                : "opacity-0 w-0 -ml-10 "
            }`}
          >
            <MoreOptionsDropdown dropdownItem={moreOptionsDropdown} />
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            className={`
              col-start-1 row-start-1 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer
              ${
                toggleViewOptions
                  ? "w-[35px] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-20"
              }
            `}
            draggable="false"
            src="/logo/x.svg"
            alt="Close"
            onClick={() => setToggleViewOptions(false)}
          />

          <div
            className={`
              absolute top-0  min-h-20 bg-moja_plava  flex items-center justify-center transition-all duration-700 ease-in-out origin-left outline outline-[3px]  outline-white rounded-[11px] overflow-clip 
              ${
                toggleViewOptions
                  ? "w-[15rem] opacity-100 right-[-17rem] z-10 "
                  : "w-[1rem] opacity-0 right-0"
              }
            `}
          >
            <div
              className={`flex transition-all duration-200  flex-col ${
                toggleViewOptions
                  ? "w-34  delay-[400ms] opacity-100"
                  : "w-0 opacity-0 h-0"
              }`}
            >
              <h5
                className={`text-center text-white glavno-nav overflow-hidden text-nowrap `}
              >
                Broj objava po stranici
              </h5>
              <SliderTocke values={valueSlider} />
            </div>
          </div>

          <img
            className={`
              col-start-1 row-start-1 hover:scale-110 transition-all duration-[300ms] ease-in-out cursor-pointer 
              ${
                !toggleViewOptions
                  ? "h-[15px] opacity-100 -translate-x-0"
                  : "h-0 opacity-0 -translate-x-10"
              }
            `}
            draggable="false"
            src="/logo/three_dots.svg"
            alt="Open"
            onClick={() => setToggleViewOptions(true)}
          />
        </div>
      )}

      <ul
        className={`col-start-3 row-start-1 transition-all duration-500 ease-in flex flex-row justify-evenly justify-self-end [&>li]:inline-block px-7 border-white border-[3px] rounded-full -mr-10  h-min ${
          toggleFilteri
            ? " w-[35rem] opacity-100 overflow-visible"
            : "w-0 opacity-0 overflow-hidden"
        }${searchInput ? " !w-[40rem]" : ""}`}
      >
        <ForumFilterBtn
          name="Popularno"
          filters={popularnoFilters}
          setFilter={setFilter}
          toggleFilteri={toggleFilteri}
          setSearchInput={setSearchInput}
        />
        <ForumFilterBtn
          name="Oprema"
          filters={opremaFilters}
          setFilter={setFilter}
          toggleFilteri={toggleFilteri}
          setSearchInput={setSearchInput}
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
      <div className="flex flex-row col-start-2 row-start-2 gap-2 mt-10 -mb-4 place-self-start 3xl:ml-32">
        <div className=" text-white  font-glavno text-[1.1rem] font-medium">
          {filter == "" ? setUrl(endpointUrl) : ""}
          {filter == "" ? (
            ""
          ) : (
            <div
              onClick={() => {
                setFilter("");
                filter.includes("pretraži") ? setSearchQuery("") : "";
              }}
              className="group hover:cursor-pointer flex flex-row  border-white border-[3px] rounded-full justify-center items-center p-[0.5rem_1rem] hover:p-[0.5rem_1.5rem] transition-all duration-300 ease-in-out bg-red"
            >
              <h6 className="relative flex items-center justify-center mr-4 mb-[-5px]">
                {filter.includes("pretraži")
                  ? ` ${filter.split(" ")[0]}  ${searchQuery}`
                  : filter}
              </h6>
              <img className="h-[15px] " src="/logo/x.svg" alt="" srcSet="" />
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
              <img className="h-[15px] " src="/logo/x.svg" alt="" srcSet="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForumFilters;
