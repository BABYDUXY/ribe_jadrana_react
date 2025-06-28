import React, { useContext, useState } from "react";
import { PaginationContext } from "../kontekst/PaginationContext";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

function ForumFilterBtn({
  name,
  filters,
  setFilter,
  toggleFilteri,
  setSearchInput,
  setFilterField,
  setSortOptions = null,
}) {
  const { currentPage, setCurrentPage } = useContext(PaginationContext);
  const { endpointUrl, setUrl, backendData } = useContext(EndpointUrlContext);

  function renderFilters(filterNode, parentIme = "") {
    return Object.entries(filterNode).map(([key, filter]) => {
      if (filter.children) {
        const currentIme =
          filter.name === "Štap"
            ? "štap"
            : filter.name === "Rola"
            ? "rola"
            : filter.name === "Mamac"
            ? "mamac"
            : filter.name === "Riba"
            ? "ime_ribe"
            : filter.name === "Mjesto"
            ? "mjesto"
            : filter.name === "Autor"
            ? "autor"
            : parentIme;
        return (
          <div
            key={key}
            className={`relative flex w-full ${
              filter.type == "hoverDropdown" ? "group/podgrupa" : "group/last"
            }`}
          >
            <div className="w-[110%] flex items-center p-[0.5rem_1rem]  border border-white gap-2 group-hover:cursor-pointer hover:bg-moja_plava-tamna">
              <button className="w-full ">{filter.name || "More"}</button>
              <img
                className={`h-[7px] transition-transform duration-300  ${
                  filter.type == "hoverDropdown"
                    ? "group-hover/podgrupa:rotate-180"
                    : "group-hover/last:rotate-180"
                }`}
                src="/logo/arrow.svg"
                alt=""
                srcSet=""
              />
            </div>
            <div
              className={`absolute top-0 z-50 hidden bg-moja_plava border border-white left-full ${
                filter.type == "hoverDropdown"
                  ? "group-hover/podgrupa:block"
                  : "group-hover/last:block"
              } `}
            >
              {renderFilters(filter.children, currentIme)}
            </div>
          </div>
        );
      }
      if (filter.type === "search") {
        return (
          <button
            key={key}
            className="hover:bg-moja_plava-tamna p-[0.5rem_1rem] border border-white w-full"
            onClick={() => {
              setFilter(filter.fullname);
              setCurrentPage(1);
              setSearchInput(true);
              setFilterField(parentIme);
            }}
          >
            {filter.name}
          </button>
        );
      }

      if (filter.sort && !filter.type) {
        return (
          <button
            key={key}
            className="hover:bg-moja_plava-tamna  p-[0.5rem_1rem] border border-white w-full "
            onClick={() => {
              setFilter(filter.fullname);
              setCurrentPage(1);
              setSortOptions(filter.sort);
            }}
          >
            {filter.name}
          </button>
        );
      }

      if (!filter.type) {
        return (
          <button
            key={key}
            className="hover:bg-moja_plava-tamna p-[0.5rem_1rem] border border-white w-full "
            onClick={() => {
              setFilter(filter.fullname);
              setCurrentPage(1);
              setFilterField(parentIme);
            }}
          >
            {filter.name}
          </button>
        );
      }
      return null;
    });
  }
  return (
    <li
      className={`relative group  ${
        toggleFilteri ? "animated-overflow" : "overflow-hidden"
      }`}
    >
      <div className="flex items-center p-[0.4rem_1rem] gap-2 group-hover:cursor-pointer">
        <button className="text-white glavno-nav">{name}</button>
        <img
          className="h-[7px] transition-transform duration-300 group-hover:rotate-180"
          src="/logo/arrow.svg"
          alt=""
          srcSet=""
        />
      </div>
      <div className="absolute top-full left-0 z-50 flex flex-col scale-y-0 origin-top ease-in-out opacity-0  bg-moja_plava transition-all duration-300  [&>*]:transition-colors [&>*]:duration-300 [&>*]:ease-in-out group-hover:scale-y-100  group-hover:opacity-100 border-white border-[3px] rounded-b-[13px] min-w-24 w-max  [&>*:last-child]:rounded-b-[10px] [&>div:last-child>div:nth-of-type(1)]:rounded-b-[10px] text-white font-glavno">
        {renderFilters(filters)}
      </div>
    </li>
  );
}

export default ForumFilterBtn;
