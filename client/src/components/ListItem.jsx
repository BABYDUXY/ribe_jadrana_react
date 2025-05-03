import React from "react";
import { Link } from "react-router-dom";

function ListItem({ value }) {
  return (
    <Link
      to={`/fish/${value.ID}`}
      className="hover:scale-y-[1.15] hover:z-10 group outline w-[18rem] aspect-video outline-[4px] outline-white rounded-[9px]  bg-moja_plava hover:cursor-pointer overflow-hidden delay-100"
      style={{
        transform: "", // Force hardware acceleration
        willChange: "transform", // Hint to browser to optimize performance
        transition: "all 250ms ease-in-out",
      }}
    >
      <div className="animate-spawn opacity-0 w-[100%] h-[80%]  justify-self-center flex  items-end justify-center rounded-[9px]  group-hover:h-[85%] transition-all ease-in-out duration-[340ms]  overflow-hidden relative flex-col outline outline-[3px] outline-white">
        <img
          src={value.slika}
          className="group-hover:scale-y-[0.95] scale-110 self-center justify-self-center w-full transition-transform duration-[340ms] ease-in-out relative "
          alt=""
        />
      </div>
      <h2 className="group-hover:scale-y-[0.85] transition-all duration-[300ms] ease-in-out text-white glavno-nav flex items-center justify-center h-[25%] group-hover:h-[20%] group-hover:font-medium ">
        {value.ime}
      </h2>
    </Link>
  );
}

export default React.memo(ListItem);
