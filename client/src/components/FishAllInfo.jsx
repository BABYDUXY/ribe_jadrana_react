import React from 'react'
import {useContext } from "react";
import { Link } from 'react-router-dom'
import { RandContext } from "../App";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function FishAllInfo({value}) {

  const broj =useContext(RandContext);
  const rand = getRandomInt(1, broj);
  return (
    <div className=" w-screen min-h-screen grid grid-rows-[repeat(10,10%);] grid-cols-[15%_1fr_15%]">
        <Link to="/" className='hover:cursor-default w-min h-min'><img className='m-10 transition-all duration-200 ease-in-out hover:cursor-pointer -scale-x-100 hover:-translate-y-1 hover:-scale-x-110 hover:scale-y-110' src="../img/arrow.png" alt="" /></Link>
        <Link
            class="w-max  h-min col-start-1 m-10"
            to={`/fish/${rand}`}
            >
            <img src="../img/dice.png" className='transition-all duration-200 ease-in-out hover:-translate-y-1 hover:scale-110' alt="" />
          </Link>
        <div className="flex col-start-2 row-start-1 mt-10 bg-blue-200 rounded-lg justify-evenly row-span-10">
            <div className='w-[35%] rounded-lg h-[18rem] overflow-hidden flex items-center justify-center'>
                <img className='w-full rounded-lg' src={`../${value.slika}`} alt="" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: value.opis }} className=' w-[50%] h-[18rem]flex items-center justify-center  [&>*]:my-5 text-lg h-max mt-[5%]'>
            
            </div>
        </div>
        <div className='col-start-2 row-start-5  rounded-lg py-4 row-span-4 w-[35%] ml-[5%] flex-col flex items-center gap-8 '>
            <h1 className='text-2xl font-bold'>{value.ime}</h1>
            <ul className='flex flex-col gap-4 text-lg'>
                <li><b>Ostali nazivi:</b><br></br>{(value.ostali_nazivi == null)?("Nema"):value.ostali_nazivi}</li>
                <li><b>Latinski:</b> {value.lat_ime}</li>
                <li><b>Vrsta:</b> <span className={(value.vrsta == 'plava')?("text-blue-600"):("text-white ")}>{value.vrsta}</span></li>
                <li><b>Dubina od </b> {value.min_dubina} m  <b>do </b>{value.max_dubina} m</li>
                <li><b>Max Duljina:</b> {value.max_duljina} cm</li>
                <li><b>Max Težina:</b> {value.max_tezina} kg</li>
                <li><b>Otrovna:</b> {(value.otrovna)?("Da"):("Ne")}</li>
            </ul>
        
        </div>
    </div>
  )
}

export default FishAllInfo