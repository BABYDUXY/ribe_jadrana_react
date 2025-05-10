import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";
function MoreOptionsDropdown({ dropdownItem }) {
  const { endpointUrl } = useContext(EndpointUrlContext);
  return (
    <div className="w-full ">
      <ul className=" w-full  text-center text-white  glavno-nav  text-[1.1rem] ">
        {Object.entries(dropdownItem).map(([key, item], index, array) => {
          return (
            <li
              key={key}
              className="flex flex-col items-center w-full group justify-evenly hover:bg-moja_plava-tamna form-btn-hover"
            >
              <Link to={item.url} className="w-full h-full">
                <span
                  className={`
                  block w-3/4 pt-2 pb-2 border-b-2 
                  group-hover:w-4/5  form-btn-hover 
                  mx-auto transition-all border-white
                  ${index === array.length - 1 ? "border-b-0" : ""}
                `}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MoreOptionsDropdown;
