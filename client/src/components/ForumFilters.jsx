import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import ForumFilterBtn from "./ForumFilterBtn";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
import { useLogin } from "../kontekst/loginContext";
import MoreOptionsDropdown from "./MoreOptionsDropdown";
import SliderTocke from "./SliderTocke";

const moreOptionsDropdown = {
  1: { name: "Nova Objava", url: "/novaobjava" },
  2: { name: "Moje Objave", url: "/mojeobjave" },
  3: { name: "Pošalji Upit", url: "/noviupit" },
};

function ForumFilters({
  setSortOptions,
  setSearchQuery,
  searchQuery,
  javniUlovi,
  setJavniUlovi,
  privatnost = "",
}) {
  console.log(javniUlovi);
  const { endpointUrl, setUrl } = useContext(EndpointUrlContext);
  const { user } = useLogin();
  const [filter, setFilter] = useState("");
  const [filterField, setFilterField] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [toggleFilteri, setToggleFilteri] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  const [moreOptionsToggle, setMoreOptionsToggle] = useState(false);
  const [toggleViewOptions, setToggleViewOptions] = useState(false);
  const valueSlider = { default: 6, step: 1, min: 3, max: 10 };
  const originalJavniUloviRef = useRef(null);
  if (originalJavniUloviRef.current === null && javniUlovi.length > 0) {
    originalJavniUloviRef.current = JSON.parse(JSON.stringify(javniUlovi));
  }

  const popularnoFilters = {
    1: {
      sort: { field: "popularnost", ascending: false },
      fullname: "Popularno A-Z",
      name: "A-Z",
    },
    2: {
      sort: { field: "popularnost", ascending: true },
      fullname: "Popularno Z-A",
      name: "Z-A",
    },
  };

  const datumFilters = {
    1: {
      sort: { field: "datum_kreiranja", ascending: true },
      fullname: "Datum A-Z",
      name: "A-Z",
    },
    2: {
      sort: { field: "datum_kreiranja", ascending: false },
      fullname: "Datum Z-A",
      name: "Z-A",
    },
  };

  const datumFiltersClanci = {
    1: {
      sort: { field: "datum", ascending: true },
      fullname: "Datum A-Z",
      name: "A-Z",
    },
    2: {
      sort: { field: "datum", ascending: false },
      fullname: "Datum Z-A",
      name: "Z-A",
    },
  };

  const ostaloFilters = {
    1: {
      type: "hoverDropdown",
      url: "",
      fullname: "Riba",
      name: "Riba",
      children: {
        1: {
          type: "search",
          fullname: "Riba: pretraži",
          name: "Pretraži",
        },
      },
    },
    2: {
      type: "hoverDropdown",
      url: "",
      fullname: "Mjesto",
      name: "Mjesto",
      children: {
        1: {
          type: "search",
          fullname: "Mjesto: pretraži",
          name: "Pretraži",
        },
      },
    },
  };

  if (privatnost !== "privatno") {
    ostaloFilters[3] = {
      type: "hoverDropdown",
      url: "",
      fullname: "Autor",
      name: "Autor",
      children: {
        1: {
          type: "search",
          fullname: "Autor: pretraži",
          name: "Pretraži",
        },
      },
    };
  }
  const [kategorijaFilters, setKategorijaFilters] = useState({
    1: {
      name: "Naziv",
      type: "dropdown",
      children: [],
    },

    2: {
      type: "search",
      fullname: "Kategorija: pretraži",
      name: "Pretraži",
    },
  });

  const [opremaFilters, setOpremaFilters] = useState({
    1: {
      type: "hoverDropdown",
      url: "",
      fullname: "Štap",
      name: "Štap",
      children: {
        1: {
          name: "Brand",
          type: "dropdown",
          children: [],
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
          children: [],
        },

        2: {
          type: "search",
          fullname: "Rola: pretraži",
          name: "Pretraži",
        },
      },
    },
    3: {
      type: "hoverDropdown",
      url: "",
      fullname: "Mamac",
      name: "Mamac",
      children: {
        1: {
          name: "Naziv",
          type: "dropdown",
          children: [],
        },

        2: {
          type: "search",
          fullname: "Mamac: pretraži",
          name: "Pretraži",
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (privatnost === "clanci") {
          const response = await fetch(`${endpointUrl}/kategorije`); // ili drugi URL
          const data = await response.json();

          // Postaviti samo kategorije bez ugniježđene strukture
          const kategorijeOptions = data.map((kategorija) => ({
            name: kategorija.kategorija,
            fullname: kategorija.kategorija,
          }));

          setKategorijaFilters((prev) => ({
            ...prev,
            1: {
              ...prev[1],
              children: kategorijeOptions,
            },
          }));
        } else {
          const response = await fetch(`${endpointUrl}/oprema`);
          const data = await response.json();

          const getUniqueBrands = (arr) => {
            const map = new Map();
            arr.forEach((item) => {
              if (item.brend && !map.has(item.brend.toLowerCase())) {
                map.set(item.brend.toLowerCase(), {
                  fullname: item.brend,
                  name: item.brend,
                });
              } else if (
                !item.brand &&
                item.model &&
                !map.has(item.model.toLowerCase())
              ) {
                map.set(item.model.toLowerCase(), {
                  fullname: item.model,
                  name: item.model,
                });
              }
            });
            return Array.from(map.values());
          };

          const stapovi = getUniqueBrands(
            data.filter((item) => item.tip.toLowerCase() === "štap")
          );
          const role = getUniqueBrands(
            data.filter((item) => item.tip.toLowerCase() === "rola")
          );
          const mamac = getUniqueBrands(
            data.filter((item) => item.tip.toLowerCase() === "mamac")
          );

          setOpremaFilters((prev) => ({
            ...prev,
            1: {
              ...prev[1],
              children: {
                ...prev[1].children,
                1: {
                  ...prev[1].children[1],
                  children: stapovi,
                },
              },
            },
            2: {
              ...prev[2],
              children: {
                ...prev[2].children,
                1: {
                  ...prev[2].children[1],
                  children: role,
                },
              },
            },
            3: {
              ...prev[3],
              children: {
                ...prev[3].children,
                1: {
                  ...prev[3].children[1],
                  children: mamac,
                },
              },
            },
          }));
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja podataka:", error);
      }
    };

    fetchData();
  }, [endpointUrl, setOpremaFilters, setKategorijaFilters]);

  useEffect(() => {
    const searchTerm = filter.includes("pretraži")
      ? searchQuery
      : filter || searchQuery || "";

    if (!searchTerm) {
      setJavniUlovi(originalJavniUloviRef.current || javniUlovi);
      return;
    }

    const originalData = originalJavniUloviRef.current || javniUlovi;

    const filtered = originalData.filter((item) => {
      // SPECIJALNA LOGIKA ZA ČLANKE - uvek filtrira samo po kategoriji
      if (privatnost === "clanci") {
        const fieldValue = item.kategorija;

        if (!fieldValue) return false;

        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return false;
      }

      // POSTOJEĆA LOGIKA ZA OSTALO (samo kada NIJE clanci)
      if (!filterField || filterField === "") {
        const searchableFields = ["ime_ribe", "mjesto", "autor", "mamac"];

        const stringFieldsMatch = searchableFields.some((field) => {
          const fieldValue = item[field];
          if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });

        const kombiniraniModelMatch =
          item.kombinirani_model && Array.isArray(item.kombinirani_model)
            ? item.kombinirani_model.some((el) =>
                typeof el === "string"
                  ? el.toLowerCase().includes(searchTerm.toLowerCase())
                  : el.toString().includes(searchTerm)
              )
            : false;

        return stringFieldsMatch || kombiniraniModelMatch;
      }

      const getFieldToFilter = () => {
        if (filterField === "štap" || filterField === "rola") {
          return "kombinirani_model";
        }
        if (filterField === "mamac") {
          return "mamac";
        }
        if (filterField === "mjesto") {
          return "mjesto";
        }
        if (filterField === "ime_ribe") {
          return "ime_ribe";
        }
        if (filterField === "autor") {
          return "autor";
        }
        return "kombinirani_model";
      };

      const fieldToFilter = getFieldToFilter();
      const fieldValue = item[fieldToFilter];

      if (!fieldValue) return false;

      if (Array.isArray(fieldValue)) {
        if (filterField === "štap") {
          const firstElement = fieldValue[0];
          return firstElement
            ? firstElement.toLowerCase().includes(searchTerm.toLowerCase())
            : false;
        }

        if (filterField === "rola") {
          const secondElement = fieldValue[1];
          return secondElement
            ? secondElement.toLowerCase().includes(searchTerm.toLowerCase())
            : false;
        }

        return fieldValue.some((el) =>
          typeof el === "string"
            ? el.toLowerCase().includes(searchTerm.toLowerCase())
            : el.toString().includes(searchTerm)
        );
      }

      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      }

      if (typeof fieldValue === "number") {
        return fieldValue.toString().includes(searchTerm);
      }

      return false;
    });

    setJavniUlovi(filtered);
  }, [filter, searchQuery, filterField, privatnost]);

  return (
    <div
      className={`grid grid-cols-[15%_35%_35%_15%] place-items-center mt-10 transition-all duration-500 ease-out  ${
        toggleFilteri ? "mb-20" : "mb-10"
      }`}
    >
      <img
        className="w-[40px] col-start-4 row-start-1 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
        src="/logo/filter.svg"
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
            src="/logo/plus.svg"
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
            src="/logo/minus.svg"
            alt=""
            onClick={() => {
              setMoreOptionsToggle(false);
            }}
          />

          <div
            className={`form-btn-hover  absolute left-[150%] text-nowrap outline outline-[3px]  outline-white rounded-[11px] overflow-clip ${
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
        className={`col-start-3 row-start-1 transition-all bg-moja_plava z-10  duration-500 ease-in flex flex-row justify-evenly justify-self-end [&>li]:inline-block px-7 border-white border-[3px] rounded-full -mr-10  h-min ${
          toggleFilteri
            ? privatnost === "privatno"
              ? " w-[35rem] opacity-100 overflow-visible "
              : privatnost === "clanci"
              ? " w-[28rem] opacity-100 overflow-visible "
              : " w-[40rem] opacity-100 overflow-visible "
            : "w-0 opacity-0 overflow-hidden"
        }${
          searchInput
            ? privatnost === "privatno"
              ? " !w-[40rem]"
              : privatnost === "clanci"
              ? " !w-[35rem]"
              : " !w-[45rem]"
            : ""
        }`}
      >
        {privatnost !== "privatno" && privatnost !== "clanci" ? (
          <ForumFilterBtn
            name="Popularno"
            filters={popularnoFilters}
            setFilter={setSortFilter}
            toggleFilteri={toggleFilteri}
            setSearchInput={setSearchInput}
            setFilterField={setFilterField}
            setSortOptions={setSortOptions}
          />
        ) : (
          ""
        )}
        {privatnost === "clanci" ? (
          <>
            <ForumFilterBtn
              name="Datum"
              filters={datumFiltersClanci}
              setFilter={setSortFilter}
              toggleFilteri={toggleFilteri}
              setSearchInput={setSearchInput}
              setFilterField={setFilterField}
              setSortOptions={setSortOptions}
            />

            <ForumFilterBtn
              name="Kategorija"
              filters={kategorijaFilters}
              setFilter={setFilter}
              toggleFilteri={toggleFilteri}
              setSearchInput={setSearchInput}
              setFilterField={setFilterField}
            />
          </>
        ) : (
          <>
            <ForumFilterBtn
              name="Datum"
              filters={datumFilters}
              setFilter={setSortFilter}
              toggleFilteri={toggleFilteri}
              setSearchInput={setSearchInput}
              setFilterField={setFilterField}
              setSortOptions={setSortOptions}
            />

            <ForumFilterBtn
              name="Oprema"
              filters={opremaFilters}
              setFilter={setFilter}
              toggleFilteri={toggleFilteri}
              setSearchInput={setSearchInput}
              setFilterField={setFilterField}
            />
            <ForumFilterBtn
              name="Ostalo"
              filters={ostaloFilters}
              setFilter={setFilter}
              toggleFilteri={toggleFilteri}
              setSearchInput={setSearchInput}
              setFilterField={setFilterField}
            />
          </>
        )}

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
          {filter == "" ? (
            ""
          ) : (
            <div
              onClick={() => {
                setFilter("");
                filter.includes("pretraži") ? setSearchQuery("") : "";
                setJavniUlovi(originalJavniUloviRef.current);
                setFilterField("");
              }}
              className="group hover:cursor-pointer flex flex-row  border-white border-[3px] rounded-full justify-center items-center p-[0.5rem_1rem] hover:p-[0.5rem_1.5rem] transition-all duration-300 ease-in-out mb-4"
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

                if (privatnost === "clanci") {
                  setSortOptions({ field: "datum", ascending: false });
                } else {
                  setSortOptions({
                    field: "datum_kreiranja",
                    ascending: false,
                  });
                }
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
