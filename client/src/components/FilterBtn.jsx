import React, { useContext } from "react";
import { PaginationContext } from "../kontekst/PaginationContext";

function FilterBtn({ name, dropdown, endpointUrl, setUrl, setFilter }) {
  const { currentPage, setCurrentPage } = useContext(PaginationContext);
  return (
    <li className="relative group">
      <div className="flex items-center p-[0.4rem_1rem] gap-2 group-hover:cursor-pointer">
        <button className="text-white glavno-nav">{name}</button>
        <img
          className="h-[7px] transition-transform duration-300 group-hover:rotate-180"
          src="/logo/arrow.svg"
          alt=""
          srcSet=""
        />
      </div>
      <div className="absolute top-full left-0 z-50 flex flex-col scale-y-0 origin-top ease-in-out overflow-hidden opacity-0  bg-moja_plava transition-all duration-300  [&>*]:transition-colors [&>*]:duration-300 [&>*]:ease-in-out group-hover:scale-y-100  group-hover:opacity-100 border-white border-[3px] rounded-b-[13px] w-24  [&>*:last-child]:rounded-b-[10px] text-white font-glavno">
        {Object.entries(dropdown).map(([key, podfilter]) => (
          <button
            key={key}
            className=" hover:bg-moja_plava-tamna p-[0.5rem_1rem] border border-white "
            onClick={() => {
              {
                podfilter.url == ""
                  ? setUrl(podfilter.sort)
                  : setUrl(`${endpointUrl}/${podfilter.url}`);
              }
              setFilter(podfilter.fullname);
              setCurrentPage(1);
            }}
          >
            {" "}
            {podfilter.name}
          </button>
        ))}
      </div>
    </li>
  );
}

export default FilterBtn;
