import React from "react";
import { Link } from "react-router-dom";

function MoreOptionsDropdown({ dropdownItem }) {
  return (
    <div className="w-full ">
      <ul className=" w-full  text-center text-white  glavno-nav  text-[1.1rem] [&>*:nth-last-child(1)>li]:border-b-0">
        {Object.entries(dropdownItem).map(([key, item]) => {
          return (
            <Link className="flex flex-col items-center w-full justify-evenly group hover:bg-moja_plava-tamna form-btn-hover">
              <li
                className="w-3/4 pt-2 pb-1 border-b-2 group-hover:w-4/5 form-btn-hover"
                key={key}
              >
                {item.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default MoreOptionsDropdown;
