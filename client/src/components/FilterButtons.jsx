import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RandContext } from "../App";


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function FilterButtons({ endpointUrl, setUrl }) {
  const [filter,setFilter]=useState("");
  const broj =useContext(RandContext);
  const rand = getRandomInt(1, broj);

  return (
    <div class="w-full h-min grid grid-cols-[20%_1fr_20%] relative items-center ">
      <h2 class="text-xl col-start-2 row-start-1">{(filter =='') ? (setUrl(endpointUrl)):(`Filter:`) }{(filter =='') ? (''):(<Link onClick={()=>{
                setFilter("");}} className=" text-base border border-black rounded-lg w-min p-[0.2rem_0.6rem] text-center ml-2">{filter}</Link>) }</h2>
      <ul class="col-start-2 mb-10 row-start-1 overflow-hidden [&>li]:inline-block justify-self-center self-center h-min">

        <li class="group">
          <button class="transition-all duration-200 ease-in-out group-hover:p-[0.5rem_1.5rem] rounded-md p-[0.5rem_1rem] border border-black ">
            vrsta
          </button>
          <div class=" opacity-0 flex w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 flex-col absolute z-50 bg-white transition-all duration-300 ease-in-out [&>*]:transition-colors [&>*]:duration-300 [&>*]:ease-in-out">
            <button
              class=" hover:bg-blue-200 p-[0.5rem_1rem] border border-black"
              onClick={() => {
                setUrl(`${endpointUrl}/plave`);
                setFilter("Plave");
              }}
            >
              Plave
            </button>
            <button
              class=" hover:bg-blue-200 p-[0.5rem_1rem] border border-black"
              onClick={() => {
                setUrl(`${endpointUrl}/bijele`);
                setFilter("Bijele");
              }}
            >
              Bijele
            </button>
            <button
              class=" hover:bg-blue-200 p-[0.5rem_1rem] border border-black"
              onClick={() => {
                setUrl(`${endpointUrl}/otrovne`);
                setFilter("Otrovne");
              }}
            >
              Otrovne
            </button>
          </div>
        </li>

        <li class="group">
          <button
            class="transition-all duration-200 ease-in-out rounded-md group-hover:p-[0.5rem_1.5rem] p-[0.5rem_1rem] border border-black"
          >
            Težina
          </button>
          <div class=" opacity-0 flex w-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 flex-col absolute z-50 bg-white transition-all duration-300 ease-in-out [&>*]:transition-colors [&>*]:duration-300 [&>*]:ease-in-out">
            <button
              class=" hover:bg-blue-200 p-[0.5rem_1rem] border border-black"
              onClick={() => {
                setUrl(`${endpointUrl}/tezinaASC`);
                setFilter("Težina A-Z");
              }}
            >
              A-Z
            </button>
            <button
              class=" hover:bg-blue-200 p-[0.5rem_1rem] border border-black"
              onClick={() => {
                setUrl(`${endpointUrl}/tezinaDESC`);
                setFilter("Težina Z-A");
              }}
            >
              Z-A
            </button>
          </div>
        </li>
        <li class="group">
          <Link
            class="transition-all duration-200 ease-in-out rounded-md group-hover:p-[0.5rem_1.5rem] p-[0.5rem_1rem] border border-black"
            to={`/fish/${rand}`}
            >
            Random
          </Link>
          </li>
      </ul>
    </div>
  );
}

export default FilterButtons;
